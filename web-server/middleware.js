const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session')
const cors = require('cors');

module.exports = {
    initMiddleware: initMiddleware,
    isLoggedIn: isLoggedIn,
    just2FAd: just2FAd,
    isEmailPassUser: isEmailPassUser,
    isExternalUser: isExternalUser,
    isNotFacebookUser: isNotFacebookUser,
    isNotGoogleUser: isNotGoogleUser
}

function initMiddleware(app, passport) {
        app.use(cors({origin: [
            "https://duohando.com"
            ], credentials: true}));
        app.enable('trust proxy');

        app.use(cookieParser(process.env.SESSION_SECRET));

        //body parser middleware for html form handling
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}));
        
        app.use(helmet());

        //use sessions (put this before passport.session())
        let ses = session({
            secret: process.env.SESSION_SECRET,
            key: process.env.SESSION_KEY,
            resave: true,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                secure: true
            }
        });
        app.use(ses);

        //initializes passport and passport sessions
        app.use(passport.initialize());
        app.use(passport.session());

        return ses;
}

//Authorization middleware functions
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("Not logged in");
    res.json({loggedIn: false, message: "You are not authorized for this page..."});
}

function just2FAd(req, res, next) {
    if (req.session.passport.user.secret === null || req.body.just2FAd) {
        return next();
    }
    return res.json({loggedIn: true, twoFactor: true});
}

function isExternalUser(req, res, next) {
    if ((req.session.passport.user.type === "Facebook" || req.session.passport.user.type === "Google") && req.session.passport.user.id !== null) {
        return next();
    }

    console.log("Was not an external user");
    res.json({external: false});
}

function isNotGoogleUser(req, res, next) {
    if (req.session.passport.user.type !== "Google") {
        return next();
    }

    console.log("Was a Google user");
    res.json({google: true});
}

function isNotFacebookUser(req, res, next) {
    if (req.session.passport.user.type !== "Facebook") {
        return next();
    }

    console.log("Was a Facebook user");
    res.json({facebook: true});
}

function isEmailPassUser(req, res, next) {
    if (req.session.passport.user.type === null && req.session.passport.user.ext_id === null) {
        return next();
    }

    console.log("Was not a Email/Password user");
    res.json({external: true});

}