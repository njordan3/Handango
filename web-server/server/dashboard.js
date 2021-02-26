const db = require('./db');
const twoFactor = require('./security');
const randomString = require('crypto-random-string');
const mailer = require('./email');

let { isLoggedIn, just2FAd, isEmailPassUser, isNotFacebookUser, isExternalUser, isNotGoogleUser} = require('./middleware');
let { hashPassword, validEmail, validPassword } = require('./security');

module.exports = {
    initDashboardRoutes: initDashboardRoutes,
    logout: logout
}

function initDashboardRoutes(app, passport) {
    app.post('/logout', function(req, res) {
        logout(req, res);
    });

    app.get('/dashboard', isLoggedIn, just2FAd, function(req, res) {
        res.json({loggedIn: true, just2FAd: true});
    });

    app.post('/changeEmail', isLoggedIn, just2FAd, isEmailPassUser, function(req, res) {
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

    app.post('/changePassword', isLoggedIn, just2FAd, isEmailPassUser, function(req, res) {
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

    app.post('/changeToEmail', isLoggedIn, just2FAd, isExternalUser, function(req, res) {
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

    app.get('/changeToGoogle', isLoggedIn, just2FAd, isNotGoogleUser, passport.authenticate('changeToGoogle', {scope: ['profile', 'email']}));
    app.get('/changeToGoogle/callback', passport.authenticate('changeToGoogle', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));

    app.get('/changeToFacebook', isLoggedIn, just2FAd, isNotFacebookUser, passport.authenticate('changeToFacebook', { scope: 'email' }));
    app.get('/changeToFacebook/callback', passport.authenticate('changeToFacebook', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));
};

function logout(req, res) {
    req.logout();
    //delete req.session.passport;
    //req.session.save();
    res.json({loggedIn: false});
}