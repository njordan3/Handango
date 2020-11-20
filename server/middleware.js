const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const session = require('express-session')
const path = require('path');

module.exports = function (express, app, passport) {
        app.enable('trust proxy');

        //serve static files for public directory
        app.use('/', express.static(path.join(__dirname, '../public')));

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
