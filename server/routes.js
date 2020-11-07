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

    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard');
    });

    app.post('/changeEmail', isLoggedIn, function(req, res) {
        user.validEmail(req.body.email_new)
        .then(function() { return user.changeEmail(req.user, req.body.email_new) })
        .then(function() {
            req.logout();
            res.redirect('/login');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });

    app.post('/changePhoneNumber', isLoggedIn, function(req, res) {
        user.validPhoneNumber(req.body.phone_num_new)
        .then(function() { return user.changePhoneNumber(req.user, req.body.phone_num_new) })
        .then(function() {
            req.logout();
            res.redirect('/login');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });

    app.post('/changePassword', isLoggedIn, function(req, res) {
        user.validPassword(req.body.password_new)
        .then(function() { return user.hashPassword(req.body.password_new) })
        .then(function(hash) { return user.changePassword(req.user, hash) })
        .then(function() {
            req.logout();
            res.redirect('/login');
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/dashboard');
        });
    });

    app.post('/gotologin', function(req, res) {
        res.redirect('/login');
    });
    app.post('/gotoregister', function(req, res) {
        res.redirect('/register');
    });

    app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Google login routing
    app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/google/callback', passport.authenticate('google', { 
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));
    // Facebook login routing
    app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/facebook/callback', passport.authenticate('facebook', { 
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));
};
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    console.log("Not authenticated");
    // if they aren't redirect them to the home page
    res.redirect('/');
}