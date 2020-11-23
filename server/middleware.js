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
    isAuthenticated: isAuthenticated
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
function isAuthenticated(req, res, next) {
    if (req.session.passport.user.logged_in) {
        return next();
    }
    console.log("Not authenticated");
    res.redirect('/');
}
