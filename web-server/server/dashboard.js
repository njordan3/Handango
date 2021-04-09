const db = require('./db');
const randomString = require('crypto-random-string');
const mailer = require('./email');
const bcrypt = require('bcrypt');

let { isLoggedIn, just2FAd, isEmailPassUser, isNotFacebookUser, isExternalUser, isNotGoogleUser} = require('./middleware');
let { hashPassword, validEmail, validPassword } = require('./security');

module.exports = {
    initDashboardRoutes: initDashboardRoutes,
    logout: logout
}

function initDashboardRoutes(app, passport) {
    app.post('/logout', function(req, res) {
        logout(req, res);
        res.json({loggedIn: false});
    });

    app.get('/dashboard', isLoggedIn, just2FAd, function(req, res) {
        res.json({loggedIn: true, just2FAd: true});
    });

    app.get('/userInfo', isLoggedIn, function(req, res) {
        let user = req.session.passport.user;
        db.getUserLessonInfo(user.id)
            .then(function(info) {
                res.json({
                    lessons: info,
                    fname: user.fname, lname: user.lname, username: user.username,
                    type: user.type, email: user.email, two_factored: user.secret !== null,
                    last_login: user.last_login, create_time: user.create_time
                });
            })
            .catch(function(err) {
                res.json({
                    error: err,
                    fname: user.fname, lname: user.lname, username: user.username,
                    type: user.type, email: user.email, two_factored: user.secret !== null,
                    last_login: user.last_login, create_time: user.create_time
                });
            });
    });

    app.post('/changeEmail', isLoggedIn, just2FAd, isEmailPassUser, function(req, res) {
        validEmail(req.body.email)
            .then(function() { return validEmail(req.body.email_new); })
            .then(function() { return db.changeEmail(req.body.email, req.body.email_new) })
            .then(function(row) { 
                mailer.sendNotificationEmail(req.session.passport.user.email, row, "email-change");
                return mailer.sendRegisterEmail(row);
            })
            .then(function() { res.json({loggedIn: true, message: "Email change successful. You will be logged out soon."}); })
            .catch(function(err) {
                console.log(err);
                res.json({loggedIn: true, error: err});
            });
    });

    app.post('/changePassword', isLoggedIn, just2FAd, isEmailPassUser, function(req, res) {
        validPassword(req.body.password)
            .then(function() { return validPassword(req.body.password_new); })
            .then(function() { return db.findUser(req.session.passport.user.email, req.session.passport.user.ext_id, false); })
            .then(function(row) { return bcrypt.compare(req.body.password, row.password_hash); })
            .then(function(result) { if(result) return hashPassword(req.body.password_new); else return Promise.reject("Invalid current password"); })
            .then(function(hash_new) { return db.changePassword(req.session.passport.user.email, hash_new) })
            .then(function(row) { return mailer.sendNotificationEmail(row.email, row, 'password-change'); })
            .then(function() { res.json({loggedIn: true, message: "Password change successful. You will be logged out soon."}); })
            .catch(function(err) {
                console.log(err);
                res.json({loggedIn: true, error: err});
            });
    });

    app.post('/changeToEmail', isLoggedIn, just2FAd, isExternalUser, function(req, res) {
        var email = req.body.email, password = req.body.password;
        db.connectToDB()
            .then(function() { return validEmail(email); })
            .then(function() { return validPassword(password); })
            .then(function() { return hashPassword(password); })
            .then(function(hash) {
                let params = [
                    null, null,
                    req.session.passport.user.email, email,
                    req.body.username,
                    randomString({length: 128, type: 'url-safe'}),
                    hash,
                    null,
                    req.session.passport.user.ext_id, null
                ];
                return db.changeLoginType(params);
            })
            .then(function(row) { return mailer.sendRegisterEmail(row); })
            .then(function() { res.json({loggedIn: true, message: "Change to email account successful. You will be logged out soon."}); })
            .catch(function(err) {
                console.log(err);
                res.json({loggedIn: true, error: err});
            });
    });

    app.get('/changeToGoogle', function(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.session.passport.user.secret === null) {
                if (req.session.passport.user.type !== "Google") {
                    next();
                } else {
                    res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isGoogle&function=changeToGoogle`);
                }
            } else {
                if (req.query.just2FAd === "true") {
                    if (req.session.passport.user.type !== "Google") {
                        next();
                    } else {
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isGoogle`);
                    }
                } else {
                    res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isNotJust2FAd&function=changeToGoogle`);
                }
            }
        } else {
            res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isNotLoggedIn`);
        }
    }, passport.authenticate('changeToGoogle', {scope: ['profile', 'email']}));
    app.get('/changeToGoogle/callback', function(req, res, next) {
        passport.authenticate('changeToGoogle', function(err, user, info) {
            if (!user) {
                res.redirect(`https://duohando.com/dashboard/GuardedSettings?err=${encodeURIComponent(info.error)}`);
            } else {
                req.logIn(user, function(err) {
                    if (err)
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?err=${encodeURIComponent(err)}`);
                    else
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?message=${encodeURIComponent("Change to Google account successful. You will be logged out soon.")}`);
                });
            }
        })(req, res, next);
    });

    app.get('/changeToFacebook', function(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.session.passport.user.secret === null) {
                if (req.session.passport.user.type !== "Facebook") {
                    next();
                } else {
                    res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isFacebook&function=changeToFacebook`);
                }
            } else {
                if (req.query.just2FAd === "true") {
                    if (req.session.passport.user.type !== "Facebook") {
                        next();
                    } else {
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isFacebook`);
                    }
                } else {
                    res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isNotJust2FAd&function=changeToFacebook`);
                }
            }
        } else {
            res.redirect(`https://duohando.com/dashboard/GuardedSettings?resp=isNotLoggedIn`);
        }
    }, passport.authenticate('changeToFacebook', {scope: 'email'}));
    app.get('/changeToFacebook/callback', function(req, res, next) {
        passport.authenticate('changeToFacebook', function(err, user, info) {
            if (!user) {
                res.redirect(`https://duohando.com/dashboard/GuardedSettings?err=${encodeURIComponent(info.error)}`);
            } else {
                req.logIn(user, function(err) {
                    if (err)
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?err=${encodeURIComponent(err)}`);
                    else
                        res.redirect(`https://duohando.com/dashboard/GuardedSettings?message=${encodeURIComponent("Change to Facebook account successful. You will be logged out soon.")}`);
                });
            }
        })(req, res, next);
    });
};

function logout(req, res) {
    req.logout();
    delete req.session.passport;
    req.session.save();    
}