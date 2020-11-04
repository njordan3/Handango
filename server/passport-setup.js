//environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} else { return console.error('You shouldnt use .env files in production'); }

var emailREGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var passwordREGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}/;

const bcrypt = require('bcrypt');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const mysql = require('./mysql');
mysql.initDB();

module.exports = function() {
    //===============================================
    //passport session setup ========================
    //===============================================
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
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
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
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
        //WELCOME TO CALLBACK HELL
        //1.) Check connection to DB
        //2.) Validate email and password format
        //3.) Find user based on given email address
        //4.) Compare given password with DB password hash
        function(req, email, password, done) {
            mysql.connectToDB(function(err) {
                if (err) {
                    return done(null, false, {message: 'Database is offline...'});
                } else {
                    if (!emailREGEX.test(email)) {
                        console.log("Caught improperly formatted email");
                        return done(null, false, {message: 'Improperly formatted email'});
                    }
                    if (!passwordREGEX.test(password)) {
                        console.log("Caught improperly formatted password");
                        return done(null, false, {message: 'Improperly formatted password'});
                    }
                    mysql.findUser(email, function(err, row) {
                        if (!row) {
                            console.log("Login attempt for non-existent user");
                            return done(null, false, {message: "That account doesn't exist"});
                        }
                        bcrypt.compare(password, row.password_hash, function(err, result) {
                            if (!result) {
                                console.log(`Failed login attempt from ${email}`);
                                return done(null, false, {message: "Wrong password"});
                            } else {
                                console.log(`${email} logged in`);
                                return done(null, {username: email});
                            }
                        });
                    });
                }
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
        //WELCOME TO CALLBACK HELL 2: ELECTRIC BOOGALOO
        //1.) Check connection to DB
        //2.) Validate email and password format
        //3.) Hash and salt password
        //4.) Compile profile information
        //5.) Add user to the database
        function(req, email, password, done) {
            mysql.connectToDB(function(err) {
                if (err) {
                    return done(null, false, {message: 'Database is offline...'});
                } else {
                    if (!emailREGEX.test(email)) {
                        console.log("Caught improperly formatted email");
                        return done(null, false, {message: 'Improperly formatted email'});
                    }
                    if (!passwordREGEX.test(password)) {
                        console.log("Caught improperly formatted password");
                        return done(null, false, {message: 'Improperly formatted password'});
                    }
                    bcrypt.hash(password, parseInt(process.env.USER_SALT), function(err, hash) {
                        var profile = [
                            req.body.firstname, req.body.lastname,
                            email, req.body.phone_num,
                            hash,
                            null, null
                        ]
                        mysql.addUser(profile, function(err, result) {
                            if (err) {
                                console.log(err.sqlMessage);
                                return done(null, false, {message: 'There was an issue registering your account'});
                            } else {
                                console.log(`User with email ${email} has been created`);
                                return done(null, {username: email});
                            }
                        });
                    });
                }
            });            
        }
    ));
};