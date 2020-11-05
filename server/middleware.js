const bodyParser = require('body-parser');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const session = require('express-session')
const path = require('path');

module.exports = function(express, app, passport) {
    //serve static files for public directory
    app.use('/', express.static(path.join(__dirname, '../public')));

    //use sessions (put this before passport.session())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {secure: true}
    }));

    //body parser middleware for html form handling
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json())
    //use helmet as middleware
    app.use(helmet());

    //initializes passport and passport sessions
    app.use(passport.initialize());
    app.use(passport.session());

    //serves favicon
    app.use(favicon(path.join(__dirname, '../favicon/favicon-32x32.png')));

    app.enable('trust proxy');
}
