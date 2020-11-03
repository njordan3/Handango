const path = require('path');
const fs = require('fs');

module.exports = function(express, app, passport) {
    //dynamically serve static files when the user is at specific URLS
    app.use('/', express.static(path.join(__dirname, '../public/home')));
    app.use('/login', express.static(path.join(__dirname, '../public/login')));
    app.use('/register', express.static(path.join(__dirname, '../public/register')));
    app.use('/dashboard', express.static(path.join(__dirname, '../public/dashboard')));

    app.get('/dashboard', isLoggedIn, function(req, res) {
        //only logged in users can see their dashboard
    });

    app.post('/gotologin', function(req, res) {
        res.redirect('/login');
    });
    app.post('/gotoregister', function(req, res) {
        res.redirect('/register');
    });

    app.post('/login', passport.authenticate('local-login', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/dashboard');
        }
    );
    
    app.post('/register', passport.authenticate('local-register', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/login');
        }
    );

    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Google login routing
    app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication
            //If user doesn't exist, add them
            res.redirect('/dashboard');
        }
    );
    // Facebook login routing
    app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication
            //If user doesn't exist, add them
            res.redirect('/dashboard');
        }
    );
};

// route middleware to check if the user is authorized
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}