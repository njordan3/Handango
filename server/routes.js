const path = require('path');
const fs = require('fs');
const flash = require('connect-flash');

module.exports = function(express, app, passport) {
    //enable passport to flash messages to user
    app.use(flash());

    // view engine setup
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname,'../views'));

    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard');
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

// route middleware to check if the user is authorized
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

    console.log("not authenticated");
	// if they aren't redirect them to the home page
	res.redirect('/');
}