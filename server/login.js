let {isLoggedIn} = require('./middleware');
const twoFactor = require('./2FA');

module.exports = {
    initLoginRoutes: initLoginRoutes
}

function initLoginRoutes(app, passport) {
    app.get('/register', function(req, res) {
        res.render('register');
    });

    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.get('/login', function(req, res) {
        if (req.session.passport) {
            if (req.session.passport.user.logged_in)
                res.redirect('/dashboard');
            else {
                res.render('login', req.session.passport.user.ejs);
            }
        } else {
            res.render('login');
        }
    });

    app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/is2FAEnabled',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/is2FAEnabled', isLoggedIn, function(req, res) {
        req.session.passport.user.ejs = {};
        if (req.session.passport.user.secret != null) {
            req.session.passport.user.two_factored = true;
            req.session.save();
            twoFactor.set2FAInfo(req, res, "/toggle2FAForm", '/login', '/dashboard');
        } else {
            req.session.passport.user.logged_in = true;
            req.session.save();
            res.redirect('/dashboard');
        }
    });

    // Google login routing
    app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/google/callback', passport.authenticate('google', { 
        successRedirect: '/is2FAEnabled',
        failureRedirect: '/',
        failureFlash: true
    }));

    // Facebook login routing
    app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/facebook/callback', passport.authenticate('facebook', { 
        successRedirect: '/is2FAEnabled',
        failureRedirect: '/',
        failureFlash: true
    }));
}