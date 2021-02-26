//environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} else { return console.error('You shouldnt use .env files in production'); }

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const randomString = require('crypto-random-string');

const db = require('./db');
db.initDB();

const mailer = require('./email');
mailer.startMailer();

let { hashPassword, validEmail, validPassword } = require('./security');

module.exports = function(passport) {
    //===============================================
    //passport session setup ========================
    //===============================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(usr, done) {
        db.findUser(usr.email, usr.id, false)
            .then(function(row) {
                if (row.sqlMessage) { return Promise.reject(`User ${usr.email} not found in Deserialize`); }
                else { done(null, {email: row.email, id: row.external_id}); }
            })
            .catch(function(err) { done(null, false, {error: err}); })
    });
    //===============================================
    //passport google login setup ===================
    //===============================================
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://duohando.com:3000/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() { return db.findUser(profile._json.email, profile._json.sub) })
                .then(function(row) {
                    if (row.sqlMessage) {   //email doesnt exist so register an account
                        profile = profile._json;
                        let fullName = profile.name.split(' ');
                        let prof = [
                            fullName[0], fullName[fullName.length-1],
                            profile.email, null,
                            null, null,
                            null,
                            'Google', profile.sub
                        ];
                        return db.Register(prof);
                    }
                    else { return Promise.resolve(row); }
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) { 
                    //organize lessons into array of JSONs
                    let desc = row.lesson_desc.split(",");
                    let unlock_date = row.lesson_udate.split(",");
                    let lecture_prog = row.lesson_lectprog.split(",");
                    let practice_prog = row.lesson_practprog.split(",");
                    let practice_comp = row.lesson_practcomp.split(",");
                    let complete = row.lesson_complete.split(",");
                    let lessons = [];
                    for (let i = 0; i < desc.length; i++) { 
                        lessons[i] = { 
                            desc: desc[i], unlock_date: unlock_date[i],
                            lecture_prog: lecture_prog[i], practice_prog: practice_prog[i],
                            practice_complete: practice_comp[i], complete: complete[i]
                        };
                    }

                    return done(null, {email: row.email, name: row.fname, type: row.external_type, id: row.external_id, secret: row.twofactor_secret, just2FAd: false, lessons: lessons});
                })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
                });
        }
    ));
    passport.use('changeToGoogle', new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://duohando.com:3000/changeToGoogle/callback",
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
                        randomString({length: 128, type: 'url-safe'}),
                        null,
                        'Google', 
                        null, profile.sub
                    ];
                    return db.changeLoginType(params);
                })
                .then(function(row) {
                    if (req.session.passport.user.secret !== null) {
                        return Promise.resolve({email: row.email, name: row.fname, type: row.external_type, id: row.external_id, secret: row.twofactor_secret});
                    } else { return Promise.resolve({email: row.email, id: row.external_id}); }
                })
                .then(function(row) { return done(null, row); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
                });
        }
    ));
    //===============================================
    //passport facebook login setup =================
    //===============================================
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://duohando.com:3000/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
            db.connectToDB()
                .then(function() { return db.findUser(profile._json.email, profile._json.id) })
                .then(function(row) {
                    if (row.sqlMessage) {   //email doesnt exist so register an account
                        profile = profile._json;
                        let fullName = profile.name.split(' ');
                        let prof = [
                            fullName[0], fullName[fullName.length-1],
                            profile.email, null,
                            null, null,
                            null,
                            'Facebook', profile.id
                        ];
                        return db.Register(prof);
                    }
                    else { return Promise.resolve(row); }
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) {
                    //organize lessons into array of JSONs
                    let desc = row.lesson_desc.split(",");
                    let unlock_date = row.lesson_udate.split(",");
                    let lecture_prog = row.lesson_lectprog.split(",");
                    let practice_prog = row.lesson_practprog.split(",");
                    let practice_comp = row.lesson_practcomp.split(",");
                    let complete = row.lesson_complete.split(",");
                    let lessons = [];
                    for (let i = 0; i < desc.length; i++) { 
                        lessons[i] = { 
                            desc: desc[i], unlock_date: unlock_date[i],
                            lecture_prog: lecture_prog[i], practice_prog: practice_prog[i],
                            practice_complete: practice_comp[i], complete: complete[i]
                        };
                    }

                    return done(null, {email: row.email, name: row.fname, type: row.external_type, id: row.external_id, secret: row.twofactor_secret, just2FAd: false, lessons: lessons});
                })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
                });
        }
    ));
    passport.use('changeToFacebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://duohando.com:3000/changeToFacebook/callback",
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
                        randomString({length: 128, type: 'url-safe'}),
                        null,
                        'Facebook', 
                        null, profile.id
                    ];
                    return db.changeLoginType(params);
                })
                .then(function(row) {
                    if (req.session.passport.user.secret !== null) {
                        return Promise.resolve({email: row.email, name: row.fname, type: row.external_type, id: row.external_id, secret: row.twofactor_secret});
                    } else { return Promise.resolve({username: row.email, id: row.external_id}); }
                })
                .then(function(row) { return done(null, row); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
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
                .then(function() { return validEmail(email); })
                .then(function() { return validPassword(password); })
                .then(function() { return db.findUser(email, null, false); })
                .then(function(row) {
                    if (row.sqlMessage) { return Promise.reject(row.sqlMessage); }
                    else if (row.external_id) return Promise.reject(`External account ${email} attempted email/password login`);
                    return db.comparePassword(email, password, row);
                })
                .then(function(row) { return db.Login(row); })
                .then(function(row) {
                    //organize lessons into array of JSONs
                    let desc = row.lesson_desc.split(",");
                    let unlock_date = row.lesson_udate.split(",");
                    let lecture_prog = row.lesson_lectprog.split(",");
                    let practice_prog = row.lesson_practprog.split(",");
                    let practice_comp = row.lesson_practcomp.split(",");
                    let complete = row.lesson_complete.split(",");
                    let lessons = [];
                    for (let i = 0; i < desc.length; i++) { 
                        lessons[i] = { 
                            desc: desc[i], unlock_date: unlock_date[i],
                            lecture_prog: lecture_prog[i], practice_prog: practice_prog[i],
                            practice_complete: practice_comp[i], complete: complete[i]
                        };
                    }
                    return done(null, {email: email, name: row.fname, type: null, id: null, secret: row.twofactor_secret, just2FAd: false, lessons: lessons});
                })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
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
                .then(function() { return validEmail(email); })
                .then(function() { return validPassword(password); })
                .then(function() { return hashPassword(password); })
                .then(function(hash) {
                    let profile = [
                        req.body.firstname, req.body.lastname,
                        email, req.body.username,
                        null, randomString({length: 128, type: 'url-safe'}),
                        hash,
                        null, null
                    ];
                    return db.Register(profile);
                })
                .then(function(row) { return mailer.sendRegisterEmail(row); })
                .then(function() { return done(null, {}); })
                .catch(function(err) {
                    console.log(err);
                    return done(null, false, {error: err});
                });
        }
    ));
};