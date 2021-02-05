const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('./db');
const bcrypt = require('bcrypt');

let {isLoggedIn} = require('./middleware');


module.exports = {
    initSecurityRoutes, initSecurityRoutes,
    set2FAInfo: set2FAInfo,
    unset2FAInfo: unset2FAInfo,
    check2FA: check2FA,
    activate2FA: activate2FA,
    forceJust2FAd: forceJust2FAd,
    hashPassword: hashPassword,
    validEmail: validEmail,
    validPassword: validPassword
}

function initSecurityRoutes(app, passport) {
    app.get('/2FA', function(req, res) {
        res.render('2FA', req.session.passport.user.ejs);
    });

    app.post('/check2FA', isLoggedIn, function(req, res) {
        check2FA(req, res)
            .then(function() {
                let redirect = req.session.passport.user.ejs.successRedirect;
                unset2FAInfo(req);
                if (redirect.charAt(0) === '/') res.redirect(redirect);
                else res.render(redirect);
            })
            .catch(function(err) {
                console.log(err);
                if (req.session.passport.user.ejs) {
                    res.redirect('/2FA');
                } else {
                    res.redirect('/login');
                }
            });
    });

    app.get('/showActivate2FAForm', isLoggedIn, function(req, res) {
        activate2FA(req)
            .then(function() {
                res.redirect('/dashboard');
            })
            .catch(function(err) {
                console.log(err);
                forceJust2FA(req, res, '/dashboard');
            });
    });

    app.post('/activate2FA', isLoggedIn, function(req, res) {
        check2FA(req, res)
            .then(function() {
                let params = [
                    req.session.passport.user.username,
                    req.session.passport.user.id,
                    req.session.passport.user.ejs.token
                ];
                return db.add2FA(params);
            })
            .then(function() {
                req.session.passport.user.ejs = {};
                req.session.save();
                res.redirect('/dashboard');
            })
            .catch(function(err) {
                console.log(err);
                res.redirect('/dashboard');
            });
    });

    app.get('/verify', function(req, res) {
        let params = req.query;
        if (req.query.evs && req.query.evs.length === 128 && Object.keys(params).length === 1) {
            db.verifyEmail(params.evs)
                .then(function() { res.render('verified', {verification_msg: "Email confirmed!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                });
        } else if (req.query.pds &&  req.query.pds.length === 128 && Object.keys(params).length === 1) {
            db.verifyDisable(params.pds, "password")
                .then(function() { res.render('verified', {verification_msg: "Account Disabled!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                });
        } else if (req.query.eds &&  req.query.eds.length === 128 && Object.keys(params).length === 1) {
            db.verifyDisableSecret(params.eds, "email")
                .then(function() { res.render('verified', {verification_msg: "Account Disabled!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                });
        } else if (req.query.pcs &&  req.query.pcs.length === 128 && Object.keys(params).length === 1) {
            db.verifyPasswordSecret(params.pcs)
                .then(function(row) { res.render('password-change', {pcs: row.passwordchange_secret}); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                });
        } else {
            res.redirect('/bad-request');
        }

        app.post('/changePasswordWithSecret', function(req, res) {
            let user;
            db.verifyPasswordSecret(req.body.pcs)
                .then(function(row) { user = row; return validPassword(req.body.password); })
                .then(function() { return hashPassword(req.body.password); })
                .then(function(hash) { return db.changePassword(user.email, hash); })
                .then(function() { return mailer.sendNotificationEmail(user.email, user, 'password-change'); })
                .then(function() { res.redirect('/'); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                });
        });
    
        app.post('/emailPasswordLink', function(req, res) {
            db.findUser(req.body.email, null, false)
                .then(function(row) { return db.addPasswordSecret(row); })
                .then(function(row) { return mailer.sendNotificationEmail(row.email, row, "forgot-password"); })
                .then(function() { res.redirect('/'); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                })
        });
    
        app.post('/retrieveEmail', function(req, res) {
            db.getEmailFromUsername(req.body.username)
                .then(function(row) { return mailer.sendNotificationEmail(row.email, row, "forgot-email"); })
                .then(function() { res.redirect('/'); })
                .catch(function(err) {
                    console.log(err);
                    res.redirect('/bad-request');
                })
        });
    });
}

function activate2FA(req) {
    //temporarily store a secret in the user's session
    return new Promise((resolve, reject) => {
        if (req.session.passport.user.secret !== null) return reject(`${req.session.passport.user.username} already enabled 2FA`);
        else {
            var secret = speakeasy.generateSecret({length: 20});
            return QRCode.toDataURL(secret.otpauth_url)
                .then(function(url) {
                    req.session.passport.user.ejs = {};
                    req.session.passport.user.ejs.qrcode = url;
                    req.session.passport.user.ejs.token = secret.base32;
                    req.session.save();
                    return resolve();
                })
                .catch(function(err) {
                    return reject(err);
                });
        }
    });
}

function check2FA(req, res) {
    return new Promise((resolve, reject) => {
        //debug
        let t = speakeasy.totp({
            secret: req.session.passport.user.secret || req.session.passport.user.ejs.token,
            encoding: 'base32'
        });
        console.log(t, req.body.token);
        
        let result = speakeasy.totp.verify({
            secret: req.session.passport.user.secret || req.session.passport.user.ejs.token,
            encoding: 'base32',
            token: req.body.token
        });
    
        if (result) {
            req.session.passport.user.just2FAd = true;
            req.session.save();
            return resolve();
        } else {
            return reject(`${req.session.passport.user.username} failed 2FA check`);
        }
    });
}

function set2FAInfo(req, res, success) {
    if (req.session.passport.user.secret !== null) {
        req.session.passport.user.ejs.successRedirect = success;
        req.session.save();
        res.redirect('/2FA');
        return true;
    }
    res.redirect(success);
    return false;
}

function unset2FAInfo(req) {
    req.session.passport.user.ejs.successRedirect = undefined;
    req.session.save();
}

function forceJust2FAd(req, res, path) {
    req.session.passport.user.just2FAd = true;
    res.redirect(path);
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.USER_SALT), function(err, hash) {
            if (err) { return reject(err); }
            return resolve(hash);
        });
    });
}

function validEmail(email) {
    let emailREGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return new Promise((resolve, reject) => {
        if (!emailREGEX.test(email)) { return reject("Improperly formatted email"); }
        return resolve();
    });
}

function validPassword(password) {
    let passwordREGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}/;
    return new Promise((resolve, reject) => {
        if (!passwordREGEX.test(password)) { return reject("Improperly formatted password"); }
        return resolve();
    });
}