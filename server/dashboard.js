const db = require('./db');
const twoFactor = require('./security');
const randomString = require('crypto-random-string');
const mailer = require('./email');

let { isLoggedIn, just2FAd, isEmailPassUser, isNotFacebookUser, isExternalUser, isNotGoogleUser } = require('./middleware');
let { hashPassword, validEmail, validPassword } = require('./security');

module.exports = {
    initDashboardRoutes: initDashboardRoutes,
    logout: logout
}

function initDashboardRoutes(app, passport) {
    app.get('/logout', function(req, res) {
        logout(req, res);
    });

    app.get('/dashboard', isLoggedIn, just2FAd, function(req, res) {
        res.render('dashboard', req.session.passport.user.ejs);
    });

    app.get('/dashboard/test', isLoggedIn, just2FAd, function(req, res) {
        res.render('lessons/lesson1/practice', req.session.passport.user.ejs);
    });

    app.get('/forms', isLoggedIn, just2FAd, function(req, res) {
        //work-arounds to these forms are possible so enforce user types to specific forms
        switch (req.query.type) {
            case 'changeEmail':
                if (req.session.passport.user.type === null) { res.render('forms', {type: req.query.type}); }
                else { twoFactor.forceJust2FAd(req, res, '/dashboard'); }
                break;
            case 'changePassword':
                if (req.session.passport.user.type === null) { res.render('forms', {type: req.query.type}); }
                else { twoFactor.forceJust2FAd(req, res, '/dashboard'); }
                break;
            case 'changeToEmail':
                if (req.session.passport.user.type !== null) { res.render('forms', {type: req.query.type}); }
                else { twoFactor.forceJust2FAd(req, res, '/dashboard'); }
                break;
            case 'changeToGoogle':
                if (req.session.passport.user.type === null || req.session.passport.user.type === "Facebook") { res.render('forms', {type: req.query.type}); }
                else { twoFactor.forceJust2FAd(req, res, '/dashboard'); }
                break;
            case 'changeToFacebook':
                if (req.session.passport.user.type === null || req.session.passport.user.type === "Google") { res.render('forms', {type: req.query.type}); }
                else { twoFactor.forceJust2FAd(req, res, '/dashboard'); }
                break;
            default:
                twoFactor.forceJust2FAd(req, res, '/dashboard');
                break;
        }
    });

    app.get('/changeEmail-2FA', isLoggedIn, isEmailPassUser, function(req, res) {
        twoFactor.set2FAInfo(req, res, '/forms?type=changeEmail');
    });
    app.post('/changeEmail', isLoggedIn, isEmailPassUser, function(req, res) {
        validEmail(req.body.email_new)
            .then(function() { return db.changeEmail(req.session.passport.user.username, req.body.email_new) })
            .then(function(row) { 
                mailer.sendNotificationEmail(req.session.passport.user.username, row, "email-change");
                return mailer.sendRegisterEmail(row);
            })
            .then(function() { res.redirect('/logout'); })
            .catch(function(err) {
                console.log(err);
                twoFactor.forceJust2FAd(req, res, '/dashboard');
            });
    });

    app.get('/changePassword-2FA', isLoggedIn, isEmailPassUser, function(req, res) {
        twoFactor.set2FAInfo(req, res, '/forms?type=changePassword');
    });
    app.post('/changePassword', isLoggedIn, isEmailPassUser, function(req, res) {
        validPassword(req.body.password_new)
            .then(function() { return hashPassword(req.body.password_new) })
            .then(function(hash) { return db.changePassword(req.session.passport.user.username, hash) })
            .then(function(row) { return mailer.sendNotificationEmail(row.email, row, 'password-change'); })
            .then(function() { res.redirect('/logout'); })
            .catch(function(err) {
                console.log(err);
                twoFactor.forceJust2FAd(req, res, '/dashboard');
            });
    });

    app.get('/changeToEmail-2FA', isLoggedIn, isExternalUser, function(req, res) {
        if (req.session.passport.user.id !== null) twoFactor.set2FAInfo(req, res, '/forms?type=changeToEmail');
        else res.redirect('/dashboard');
    });
    app.post('/changeToEmail', isLoggedIn, isExternalUser, function(req, res) {
        var email = req.body.email, password = req.body.password;
        db.connectToDB()
            .then(function() { return validEmail(email); })
            .then(function() { return validPassword(password); })
            .then(function() { return hashPassword(password); })
            .then(function(hash) {
                let params = [
                    null, null,
                    req.session.passport.user.username, email,
                    req.body.username,
                    randomString({length: 128, type: 'url-safe'}),
                    hash,
                    null,
                    req.session.passport.user.id, null
                ];
                return db.changeLoginType(params);
            })
            .then(function(row) { return mailer.sendRegisterEmail(row); })
            .then(function() { res.redirect('/logout'); })
            .catch(function(err) {
                console.log(err);
                twoFactor.forceJust2FAd(req, res, '/dashboard');
            });
    });

    app.get('/changeToGoogle-2FA', isLoggedIn, isNotGoogleUser, function(req, res) {
        if (req.session.passport.user.type !== 'Google') twoFactor.set2FAInfo(req, res, '/forms?type=changeToGoogle');
        else twoFactor.forceJust2FAd(req, res, '/dashboard');
    });
    app.get('/changeToGoogle', isLoggedIn, isNotGoogleUser, passport.authenticate('changeToGoogle', {scope: ['profile', 'email']}));
    app.get('/changeToGoogle/callback', passport.authenticate('changeToGoogle', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));

    app.get('/changeToFacebook-2FA', isLoggedIn, isNotFacebookUser, function(req, res) {
        if (req.session.passport.user.type !== 'Facebook') twoFactor.set2FAInfo(req, res, '/forms?type=changeToFacebook');
        else twoFactor.forceJust2FAd(req, res, '/dashboard');
    });
    app.get('/changeToFacebook', isLoggedIn, isNotFacebookUser, passport.authenticate('changeToFacebook', { scope: 'email' }));
    app.get('/changeToFacebook/callback', passport.authenticate('changeToFacebook', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));
};

function logout(req, res) {
    req.logout();
    req.session.passport = undefined;
    req.session.save();
    res.redirect('/');
}