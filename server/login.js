module.exports = {
    initLoginRoutes: initLoginRoutes
}

function initLoginRoutes(app, passport) {
    app.get('/register', function(req, res) {
        res.render('register');
    });

    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/logout',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.get('/login', function(req, res) {
        if (req.session.passport && req.session.passport.user) {
            if (req.session.passport.user.logged_in)
                res.redirect('/dashboard');
            else {
                res.render('login', req.session.passport.user.ejs);
            }
        } else {
            res.render('login');
        }
    });

    // Google local routing
    app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

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
}