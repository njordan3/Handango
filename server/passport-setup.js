//environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} else { return console.error('You shouldnt use .env files in production'); }

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const user = require('./user');
user.initDB();

module.exports = function(passport) {
    //===============================================
    //passport session setup ========================
    //===============================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(usr, done) {
        user.findUser(usr.username, usr.id)
            .then(function(row) { done(null, row.email); })
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
            user.connectToDB()
                .then(function() {
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let prof = [
                        fullName[0], fullName[fullName.length-1],
                        profile.email, null,
                        null,
                        'Google', profile.sub
                    ];
                    return user.Register(prof);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
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
            user.connectToDB()
                .then(function() {
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let params = [
                        fullName[0], fullName[fullName.length-1],
                        req.user, profile.email,
                        null,
                        'Google',
                        null, profile.sub
                    ];
                    return user.changeLoginType(params);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
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
            user.connectToDB()
                .then(function() {
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let prof = [
                        fullName[0], fullName[fullName.length-1],
                        profile.email, null,
                        null,
                        'Facebook', profile.id
                    ];
                    return user.Register(prof);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
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
            user.connectToDB()
                .then(function() {
                    profile = profile._json;
                    let fullName = profile.name.split(' ');
                    let params = [
                        fullName[0], fullName[fullName.length-1],
                        req.user, profile.email,
                        null,
                        'Facebook',
                        null, profile.id
                    ];
                    return user.changeLoginType(params);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
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
            user.connectToDB()
                .then(function() { return user.validEmail(email); })
                .then(function() { return user.validPassword(password); })
                .then(function() { return user.findUser(email); })
                .then(function(row) {
                    if (row.external_id) return Promise.reject(new Error("External account attempted email/password login"));
                    return user.comparePassword(email, row.login_attempts, password, row.password_hash);
                })
                .then(function() { return done(null, {username: email, id: null}); })
                .catch(function(err) {
                    console.log(err);
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
            user.connectToDB()
                .then(function() { return user.validEmail(email); })
                .then(function() { return user.validPassword(password); })
                .then(function() { return user.hashPassword(password); })
                .then(function(hash) {
                    let profile = [
                        req.body.firstname, req.body.lastname,
                        email, req.body.phone_num,
                        hash,
                        null, null
                    ];
                    return user.Register(profile);
                })
                .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
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
        user.connectToDB()
            .then(function() { return user.validEmail(email); })
            .then(function() { return user.validPassword(password); })
            .then(function() { return user.hashPassword(password); })
            .then(function(hash) {
                let params = [
                    null, null,
                    req.user, email,
                    hash,
                    null,
                    req._passport.session.user.id, null
                ];
                return user.changeLoginType(params);
            })
            .then(function(row) { return done(null, {username: row.email, id: row.external_id}); })
            .catch(function(err) {
                console.log(err);
                return done(null, false, {message: err});
            });
    }
));
};
