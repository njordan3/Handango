const path = require('path');
const fs = require('fs');
const flash = require('connect-flash');
const user = require('./user');

module.exports = function(app, passport) {
    //enable passport to flash messages to user
    app.use(flash());

    // view engine setup
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname,'../views'));

    app.get('/dashboard', isLoggedIn, is2FAuthenticated, function(req, res) {
        res.render('dashboard');
    });

    app.get('/logout', function(req, res) {
        logout(req);
        res.redirect('/');
    });

    app.post('/gotologin', function(req, res) {
        if (req.session.passport) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    });
    app.post('/gotoregister', function(req, res) {
        res.redirect('/register');
    });
    app.get('/goto2FA', isLoggedIn, function(req, res) {
        if (req.session.passport.user.secret != null) {
            res.redirect('/2FA');
        } else {
            req.session.passport.user.authenticated = true;
            req.session.save();
            res.redirect('/dashboard');
        }
    });

    app.post('/2FA', isLoggedIn, function(req, res) {
        if (user.verify2FA(req.session.passport.user.secret, req.body.token)) {
            req.session.passport.user.secret = null;
            req.session.passport.user.authenticated = true;
            req.session.save();
            res.redirect('/dashboard');
        } else {
            res.redirect('/2FA');
        }
    });
    app.post('/activate2FA', isLoggedIn, function(req, res) {
        user.activate2FA(req.session.passport.user.username, req.user.id)
        .then(function() {
            req.logout();
            res.redirect('/logout');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });

    app.post('/changeEmail', isLoggedIn, is2FAuthenticated, function(req, res) {
        user.validEmail(req.body.email_new)
        .then(function() { return user.changeEmail(req.session.passport.user.username, req.body.email_new) })
        .then(function() {
            req.logout();
            res.redirect('/logout');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });
    app.post('/changePassword', isLoggedIn, is2FAuthenticated, function(req, res) {
        user.validPassword(req.body.password_new)
        .then(function() { return user.hashPassword(req.body.password_new) })
        .then(function(hash) { return user.changePassword(req.session.passport.user.username, hash) })
        .then(function() {
            req.logout();
            res.redirect('/logout');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });

    app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/goto2FA',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.post('/changeToEmail', isLoggedIn, is2FAuthenticated, passport.authenticate('changeToEmail', {
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));

    // Google login routing
    app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/google/callback', passport.authenticate('google', { 
        successRedirect: '/goto2FA',
        failureRedirect: '/',
        failureFlash: true
    }));
    app.get('/changeToGoogle', isLoggedIn, is2FAuthenticated, passport.authenticate('changeToGoogle', {scope: ['profile', 'email']}));
    app.get('/changeToGoogle/callback', passport.authenticate('changeToGoogle', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));
    // Facebook login routing
    app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/facebook/callback', passport.authenticate('facebook', { 
        successRedirect: '/goto2FA',
        failureRedirect: '/',
        failureFlash: true
    }));
    app.get('/changeToFacebook', isLoggedIn, is2FAuthenticated, passport.authenticate('changeToFacebook', { scope: 'email' }));
    app.get('/changeToFacebook/callback', passport.authenticate('changeToFacebook', { 
        successRedirect: '/logout',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));
};

//Authorization middleware functions
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("Not logged in");
    res.redirect('/');
}
function is2FAuthenticated(req, res, next) {
    if (req.session.passport.user.secret == null && req.session.passport.user.authenticated) {
        return next();
    }
    console.log("Not authenticated");
    res.redirect('/');
}

function logout(req) {
    req.logout();
    req.session.passport = undefined;
    req.session.save();
}