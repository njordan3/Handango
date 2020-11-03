//environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} else { return console.error('You shouldnt use .env files in production'); }

//const bcrypt = require('bcrypt');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// connect to existing MySQL server
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});
connection.connect(function(err) {
    if (err) { return console.error('error: ' + err.message); }
    console.log('Connected to the MySQL server.');
});
connection.query('USE ' + process.env.DB_NAME);
connection.end();

module.exports = function() {
    //===============================================
    //passport session setup ========================
    //===============================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    //===============================================
    //passport google login setup ===================
    //===============================================
    passport.use('google', new GoogleStrategy({
        clientID: "600277126585-94hhjv378m79343pdjnn2mmnn3diea5p.apps.googleusercontent.com",
        clientSecret: "zhRu9BV0Seyi2cj8RYwRM5Kc",
        callbackURL: "https://duohando.com/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        /*
        use the profile info (mainly profile id) to check if the user is registerd in ur db
        If yes select the user and pass him to the done callback
        If not create the user and then select him and pass to callback
        */
        return done(null, profile);
      }
    ));
    //===============================================
    //passport facebook login setup =================
    //===============================================
    passport.use('facebook', new FacebookStrategy({
        clientID: "370584830733552",
        clientSecret: "6be9eb375ba6ff4ccbabf4a512249fd5",
        callbackURL: "https://duohando.com/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
            /*
            use the profile info (mainly profile id) to check if the user is registerd in ur db
            If yes select the user and pass him to the done callback
            If not create the user and then select him and pass to callback
            */
            return done(null, profile);
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
        async function(req, email, password, done) {
            // if user exists
            //    if password matches
            //        
            console.log('login');
            return done(null, user);
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
        async function(req, email, password, done) {
            // if user exists
            //    if password matches
            //        
            console.log('register');
            return done(null, user);
        }
    ));
};