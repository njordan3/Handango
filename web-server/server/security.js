const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('./db');
const bcrypt = require('bcrypt');
const mailer = require('./email');

let { isLoggedIn } = require('./middleware');


module.exports = {
    initSecurityRoutes, initSecurityRoutes,
    activate2FA: activate2FA,
    hashPassword: hashPassword,
    validEmail: validEmail,
    validPassword: validPassword
}

function initSecurityRoutes(app, passport) {
    app.post('/2FACheck', function(req, res) {
        //debug
        let t = speakeasy.totp({
            secret: req.session.passport.user.secret,
            encoding: 'base32'
        });
        console.log(t, req.body.code);
        ///////////

        let result = speakeasy.totp.verify({
            secret: req.session.passport.user.secret,
            encoding: 'base32',
            token: req.body.code
        });
    
        if (result) {
            res.json({message: "Two-Factor verification successful. Action complete."});
        } else {
            res.json({error: "Incorrect code. Try again."});
        }
    });

    app.post('/login2FACheck', function(req, res) {
        //debug
        let t = speakeasy.totp({
            secret: req.session.temp.secret,
            encoding: 'base32'
        });
        console.log(t, req.body.code);
        ///////////

        let result = speakeasy.totp.verify({
            secret: req.session.temp.secret,
            encoding: 'base32',
            token: req.body.code
        });
    
        if (result) {
            req.logIn(req.session.temp, function(err) {
                if (err) { return res.json(err); }
                //delete temporary user in session
                delete req.session.temp;
                return res.json({fname: req.session.passport.user.fname });
            });
        } else {
            return res.json({error: "Incorrect code. Try again."});
        }
    })

    app.get('/getActivate2FAData', isLoggedIn, function(req, res) {
        var secret = speakeasy.generateSecret({length: 20});
        QRCode.toDataURL(secret.otpauth_url)
            .then(function(url) {
                req.session.two = {qrcode: url, secret: secret.base32};
                req.session.save();
                res.json({qrcode: url, secret: secret.base32});
            })
            .catch(function(err) {
                console.log(err);
                res.json({error: "There was an issue generating Two-Factor data..."});
            });
    });

    app.post('/tryActivate2FA', isLoggedIn, function(req, res) {
        //debug
        let t = speakeasy.totp({
            //secret: req.session.passport.user.two.secret,
            secret: req.session.two.secret,
            encoding: 'base32'
        });
        console.log(t, req.body.code);
        ///////////

        let result = speakeasy.totp.verify({
            secret: req.session.two.secret,
            encoding: 'base32',
            token: req.body.code
        });
    
        if (result) {
            let params = [
                req.session.passport.user.email,
                req.session.passport.user.ext_id,
                req.session.two.secret
            ];
            db.add2FA(params)
                .then(() => {
                    req.session.passport.user.secret = req.session.two.secret;
                    delete req.session.two;
                    req.session.save();
                    res.json({});
                })
                .catch((err) => {
                    console.log(err);
                    res.json({error: err});
                })
            
        } else {
            return res.json({error: "Incorrect code. Try again."});
        }
    });

    app.post('/forgot-password', function(req, res) {
        db.findUser(req.body.email, null, false)
            .then(function(row) { return db.addPasswordSecret(row); })
            .then(function(row) { return mailer.sendNotificationEmail(row.email, row, "forgot-password"); })
            .then(function() { res.json({}); })
            .catch(function(err) {
                console.log(err);
                res.json({error: err});
            })
    });

    app.post('/forgot-email', function(req, res) {
        db.getEmailFromUsername(req.body.username)
            .then(function(row) { return mailer.sendNotificationEmail(row.email, row, "forgot-email"); })
            .then(function() { res.json({}); })
            .catch(function(err) {
                console.log(err)
                res.json({error: err});
            })
    });

    app.post('/confirm', function(req, res) {
        let {data, type, secret} = req.body;
        if (type === "evs" && secret.length === 128) {
            db.verifyEmail(secret)
                .then(function() { res.json({message: "Email confirmed!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.json({error: err});
                });
        } else if (type === "pds" &&  secret.length === 128) {
            db.verifyDisableSecret(secret, "password")
                .then(function() { res.json({message: "Account Disabled!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.json({error: err});
                });
        } else if (type === "eds" &&  secret.length === 128) {
            db.verifyDisableSecret(secret, "email")
                .then(function() { res.json({message: "Account Disabled!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.json({error: err});
                });
        } else if (type === "pcs" &&  secret.length === 128) {
            let user;
            db.verifyPasswordSecret(secret)
                .then(function(row) { user = row; return validPassword(data.password); })
                .then(function() { return hashPassword(data.password); })
                .then(function(hash) { return db.changePassword(user.email, hash); })
                .then(function(row) { return mailer.sendNotificationEmail(user.email, row, 'password-change'); })
                .then(function() { res.json({message: "Your password has been changed successfully!"}); })
                .catch(function(err) {
                    console.log(err);
                    res.json({error: err});
                });
        } else {
            res.json({error: "Unknown confirmation method..."});
        }
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
                    req.session.passport.user.temp = {};
                    req.session.passport.user.temp.qrcode = url;
                    req.session.passport.user.temp.token = secret.base32;
                    req.session.save();
                    return resolve();
                })
                .catch(function(err) {
                    return reject(err);
                });
        }
    });
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