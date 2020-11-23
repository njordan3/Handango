//environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} else { return console.error('You shouldnt use .env files in production'); }

const twoFactor = require('./2FA');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const db = require('./db');
db.initDB();

const email = require('./email');
email.startMailer();

module.exports = function(passport) {
    //===============================================
    //passport session setup ========================
    //===============================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(usr, done) {
        db.findUser(usr.username, usr.id, false)
            .then(function(row) {
                if (row.sqlMessage) {
                    return Promise.reject(`User ${usr.username} not found in Deserialize`);
                } else {
                    done(null, {username: row.email, id: row.external_id});
                }
            })
            .catch(function(err) { done(null, false, {message: err}); })
    });
    //===============================================
    //passport google login setup ===================
    //===============================================
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://duohando.com/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() { return db.findUser(profile._json.email, profile._json.sub) })
                .then(function(row) {
                    if (row.sqlMessage) {
                        profile = profile._json;
                        let fullName = profile.name.split(' ');
                        let prof = [
                            fullName[0], fullName[fullName.length-1],
                            profile.email, null,
                            null,
                            'Google', profile.sub
                        ];
                        return db.Register(prof);
                    } else {
                        return Promise.resolve(row);
                    }
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id, secret: row.secret}); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {message: err});
                });
        }
    ));
    passport.use('changeToGoogle', new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://duohando.com/changeToGoogle/callback",
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() {
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let params = [
                        fullName[0], fullName[fullName.length-1],
                        req.session.passport.user.username, profile.email,
                        null,
                        'Google', 
                        null, profile.sub
                    ];
                    return db.changeLoginType(params);
                })
                .then(function(row) {
                    //calling done() resets the passport user to whatever object we pass it,
                    //we need to make sure the user is still authorized to get onto their dashboard
                    if (req.session.passport.user.two_factored) {
                        //emulating set2FAInfo
                        row = {
                            username: row.email, id: row.external_id, secret: row.secret,
                            ejs: {
                                toggle2FAForm: true,
                                action: "/toggle2FAForm",
                                failRedirect: '/dashboard',
                                successRedirect: '/logout'
                            },
                            logged_in: true,
                            two_factored: true
                        }
                        return Promise.resolve(row);
                    } else {
                        return Promise.resolve({username: row.email, id: row.external_id});
                    }
                })
                .then(function(row) { return done(null, row); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {message: err});
                });
        }
    ));
    //===============================================
    //passport facebook login setup =================
    //===============================================
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://duohando.com/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() { return db.findUser(profile._json.email, profile._json.id) })
                .then(function(row) {
                    if (row.sqlMessage) {
                        profile = profile._json;
                        let fullName = profile.name.split(' ');
                        let prof = [
                            fullName[0], fullName[fullName.length-1],
                            profile.email, null,
                            null,
                            'Facebook', profile.id
                        ];
                        return db.Register(prof);
                    } else {
                        return Promise.resolve(row);
                    }
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id, secret: row.secret}); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {message: err});
                });
        }
    ));
    passport.use('changeToFacebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://duohando.com/changeToFacebook/callback",
        profileFields: ['id', 'displayName', 'email'],
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() { 
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let params = [
                        fullName[0], fullName[fullName.length-1],
                        req.session.passport.user.username, profile.email,
                        null,
                        'Facebook', 
                        null, profile.id
                    ];
                    return db.changeLoginType(params);
                })
                .then(function(row) {
                    //calling done() resets the passport user to whatever object we pass it,
                    //we need to make sure the user is still authorized to get onto their dashboard
                    if (req.session.passport.user.two_factored) {
                        //emulating set2FAInfo
                        row = {
                            username: row.email, id: row.external_id, secret: row.secret,
                            ejs: {
                                toggle2FAForm: true,
                                action: "/toggle2FAForm",
                                failRedirect: '/dashboard',
                                successRedirect: '/logout'
                            },
                            logged_in: true,
                            two_factored: true
                        }
                        return Promise.resolve(row);
                    } else {
                        return Promise.resolve({username: row.email, id: row.external_id});
                    }
                })
                .then(function(row) { return done(null, row); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {message: err});
                });
        }
    ));
    //===============================================
    //passport form login setup =====================
    //===============================================
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            db.connectToDB()
                .then(function() { return db.validEmail(email); })
                .then(function() { return db.validPassword(password); })
                .then(function() { return db.findUser(email, null, false); })
                .then(function(row) {
                    if (row.sqlMessage) {
                        return Promise.reject(row.sqlMessage);
                    }
                    if (row.external_id) return Promise.reject(`External account ${email} attempted email/password login`);
                    return db.comparePassword(email, password, row);
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) { return done(null, {username: email, id: null, secret: row.secret}); })
                .catch(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    return done(null, false, {message: err});
                });
        }
    ));
    //===============================================
    //passport form register setup ==================
    //===============================================
    passport.use('local-register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            db.connectToDB()
                .then(function() { return db.findUser(email, null); })
                .then(function(row) {
                    if (row.sqlMessage) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject(`Can't register existing account ${email}`);
                    }
                })
                .then(function() { return db.validEmail(email); })
                .then(function() { return db.validPassword(password); })
                .then(function() { return db.hashPassword(password); })
                .then(function(hash) {
                    let profile = [
                        req.body.firstname, req.body.lastname,
                        email, null,
                        hash,
                        null, null
                    ];
                    return db.Register(profile);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id, secret: row.secret}); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {message: err});
                });
        }
    ));
    passport.use('changeToEmail', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, email, password, done) {
        new Promise((resolve, reject) => {
                if (req.session.passport.user.id == null) {
                    return reject(`${req.session.passport.user.username} tried to change to an email account as an email account`);
                } else {
                    return resolve();
                }
            })
            .then(function() { return db.connectToDB(); })
            .then(function() { return db.validEmail(email); })
            .then(function() { return db.validPassword(password); })
            .then(function() { return db.hashPassword(password); })
            .then(function(hash) {
                let params = [
                    null, null,
                    req.session.passport.user.username, email,
                    hash,
                    null,
                    req.session.passport.user.id, null
                ];
                return db.changeLoginType(params);
            })
            .then(function(row) {
                //calling done() resets the passport user to whatever object we pass it,
                //we need to make sure the user is still authorized to get onto their dashboard
                if (req.session.passport.user.two_factored) {
                    //emulating set2FAInfo
                    row = {
                        username: row.email, id: row.external_id, secret: row.secret,
                        ejs: {
                            toggle2FAForm: true,
                            action: "/toggle2FAForm",
                            failRedirect: '/dashboard',
                            successRedirect: '/logout'
                        },
                        logged_in: true,
                        two_factored: true
                    }
                    return Promise.resolve(row);
                } else {
                    return Promise.resolve({username: row.email, id: row.external_id});
                }
            })
            .then(function(row) { return done(null, row); })
            .catch(function(err) {
                console.log(err);
                return done(null, false, {message: err});
            });
    }
));
};