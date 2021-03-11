const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const session = require('express-session')
const path = require('path');
const flash = require('connect-flash');
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

function initMiddleware(express, app, passport) {
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

        //serves favicon
        app.use(favicon(path.join(__dirname, '../favicon/favicon-32x32.png')));
        return ses;
}

//Authorization middleware functions
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("Not logged in");
    res.json({loggedIn: false, message: "You are not authorized for this page..."});
}

/*
    How to use this maybe:
        Angular makes request with this middleware:
        if not just2FAd, then open the 2FA modal
            when correct code is submitted, set just2FAd to true and return json
            dismiss modal and have the user click submit on the original form again
                OR
            dismiss modal and use:
                this.modalService.activeInstances.subscribe((closed) => {
                    console.log("here");
                })
            which is called when the modal gets closed and recall the doWhatever function in the component (do not call auth.service function directly)
        if just2FAd or not 2FAd at all
            continue with the request by calling next();
*/
function just2FAd(req, res, next) {
    if (req.session.passport.user.secret === null) {
        return next();
    }
    if (!req.session.passport.user.just2FAd) {
        console.log("Was not just 2FAd");
        return res.json({just2FAd: false})
    }
    return next();
}

function isExternalUser(req, res, next) {
    console.log(req.session.passport.user.type, req.session.passport.user.id);
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
    if (req.session.passport.user.type === null && req.session.passport.user.id === null) {
        return next();
    }

    console.log("Was not a Email/Password user");
    res.json({external: true});

}