const db = require('./db');
const twoFactor = require('./2FA');

let {isLoggedIn, isAuthenticated} = require('./middleware');

module.exports = {
    initDashboardRoutes: initDashboardRoutes,
    logout: logout
}

function initDashboardRoutes(app, passport) {
    app.get('/logout', function(req, res) {
        logout(req, res);
    });

    app.get('/dashboard', isLoggedIn, isAuthenticated, function(req, res) {
        res.render('dashboard', req.session.passport.user.ejs);
    });
    
    app.post('/toggle2FAForm', isLoggedIn, function(req, res) {
        twoFactor.check2FA(req, res)
            .then(function() {
                if (req.session.passport.user.ejs.toggle2FAForm) {
                    let redirect = req.session.passport.user.ejs.successRedirect;
                    twoFactor.unset2FAInfo(req);
                    res.redirect(redirect);
                } else {
                    res.redirect('/dashboard');
                }
            })
            .catch(function(err) {
                console.log(err);
                if (req.session.passport.user.ejs) {
                    res.redirect(req.session.passport.user.ejs.failRedirect);
                } else {
                    res.redirect('/login');
                }
            });
    });

    app.get('/showActivate2FAForm', isLoggedIn, function(req, res) {
        twoFactor.activate2FA(req)
            .then(function() {
                res.redirect('/dashboard');
            })
            .catch(function(err) {
                console.log(err);
                res.redirect('/dashboard');
            });
    });

    app.post('/activate2FA', isLoggedIn, function(req, res) {
        twoFactor.check2FA(req, res)
            .then(function() {
                let params = [
                    req.session.passport.user.username,
                    req.session.passport.user.id,
                    req.session.passport.user.ejs.token
                ];
                return db.add2FA(params); })
            .then(function() {
                req.session.passport.user.ejs = undefined;
                req.session.save();
                res.redirect('/dashboard');
            })
            .catch(function(err) {
                console.log(err);
                res.redirect('/dashboard');
            });
    });

    app.post('/changeEmail', isLoggedIn, isAuthenticated, function(req, res) {
        db.validEmail(req.body.email_new)
            .then(function() { return db.changeEmail(req.session.passport.user.username, req.body.email_new) })
            .then(function() { return twoFactor.set2FAInfo(req, res, "/toggle2FAForm", '/dashboard', '/logout'); })
            .catch(function(err) {
                console.log(err);
                res.redirect('/dashboard');
            });
    });
    app.post('/changePassword', isLoggedIn, isAuthenticated, function(req, res) {
        db.validPassword(req.body.password_new)
            .then(function() { return db.hashPassword(req.body.password_new) })
            .then(function(hash) { return db.changePassword(req.session.passport.user.username, hash) })
            .then(function() { return twoFactor.set2FAInfo(req, res, "/toggle2FAForm", '/dashboard', '/logout'); })
            .catch(function(err) {
                console.log(err);
                res.redirect('/dashboard');
            });
    });

    app.post('/changeToEmail', isLoggedIn, isAuthenticated, passport.authenticate('changeToEmail', {
        successRedirect: '/dashboard',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));

    app.get('/changeToGoogle', isLoggedIn, isAuthenticated, passport.authenticate('changeToGoogle', {scope: ['profile', 'email']}));
    app.get('/changeToGoogle/callback', passport.authenticate('changeToGoogle', { 
        successRedirect: '/dashboard',
        failureRedirect: '/dashboard',
        failureFlash: true
    }));

    app.get('/changeToFacebook', isLoggedIn, isAuthenticated, passport.authenticate('changeToFacebook', { scope: 'email' }));
    app.get('/changeToFacebook/callback', passport.authenticate('changeToFacebook', { 
        successRedirect: '/dashboard',
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