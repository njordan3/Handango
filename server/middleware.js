const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const session = require('express-session')
const path = require('path');
const flash = require('connect-flash');

module.exports = {
    initMiddleware: initMiddleware,
    isLoggedIn: isLoggedIn,
    just2FAd: just2FAd,
    isEmailPassUser: isEmailPassUser,
    isExternalUser: isExternalUser,
    isNotFacebookUser: isNotFacebookUser,
    isNotGoogleUser: isNotGoogleUser
}

function initMiddleware(express, app, passport) {
        app.enable('trust proxy');

        //serve static files for public directory
        app.use('/', express.static(path.join(__dirname, '../public')));

        //enable passport to flash messages to user
        app.use(flash());

        // view engine setup
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname,'../views'));

        app.use(cookieParser(process.env.SESSION_SECRET));

        //body parser middleware for html form handling
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}));
        
        app.use(helmet());

        //use sessions (put this before passport.session())
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                secure: true
            }
        }));

        //initializes passport and passport sessions
        app.use(passport.initialize());
        app.use(passport.session());

        //serves favicon
        app.use(favicon(path.join(__dirname, '../favicon/favicon-32x32.png')));
}

//Authorization middleware functions
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("Not logged in");
    res.redirect('/');
}

function just2FAd(req, res, next) {
    if (req.session.passport.user.just2FAd) {
        req.session.passport.user.just2FAd = false;
        return next();
    }
    if (req.session.passport.user.secret === null) {
        return next();
    }
    console.log("Was not just 2FAd");
    res.redirect('/2FA');
}

function isExternalUser(req, res, next) {
    console.log(req.session.passport.user.type, req.session.passport.user.id);
    if ((req.session.passport.user.type === "Facebook" || req.session.passport.user.type === "Google") && req.session.passport.user.id !== null) {
        return next();
    }

    console.log("Was not an external user");
    req.session.passport.user.just2FAd = true;
    res.redirect('/dashboard');
}

function isNotGoogleUser(req, res, next) {
    if (req.session.passport.user.type !== "Google") {
        return next();
    }

    console.log("Was a Google user");
    req.session.passport.user.just2FAd = true;
    res.redirect('/dashboard');
}

function isNotFacebookUser(req, res, next) {
    if (req.session.passport.user.type !== "Facebook") {
        return next();
    }

    console.log("Was a Facebook user");
    req.session.passport.user.just2FAd = true;
    res.redirect('/dashboard');
}

function isEmailPassUser(req, res, next) {
    if (req.session.passport.user.type === null && req.session.passport.user.id === null) {
        return next();
    }

    console.log("Was not a Email/Password user");
    req.session.passport.user.just2FAd = true;
    res.redirect('/dashboard');
}