//server dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
var session = require('express-session')

//used to create file path strings
const path = require('path');
//file system
const fs = require('fs');

//default to HTTPS connection
var options = {};
var protocol = require('https');
var port = 443;
try {
    //get OpenSSL credentials
    options = {
        key: fs.readFileSync(__dirname + "/tls/privkey.pem"),
        cert: fs.readFileSync(__dirname + "/tls/cert.pem")
    }
} catch (e) {
    //change to HTTP connection
    protocol = require('http');
    port = 3000;
}

//initialize express app
const app = express();
app.enable('trust proxy');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true
    }
}));
//use helmet as middleware
app.use(helmet());
//body parser middleware for html form handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//serve public directory to client
app.use(express.static(path.join(__dirname, '../public')));
//enable cors
app.use(cors({origin: [
    "http://localhost:4200"
    ], credentials: true}));

app.post('/login', function(req, res) {
    console.log(`login attempt from ${req.body.email}`);
    req.session.username = req.body.email;
    req.session.save(function(err) {
        if (err) { res.json({error: "There was an error logging in..."}); }
        else { res.json({username: req.session.username, loggedIn: true}); }
    });
   
});

app.get('/login', function(req, res) {
    //check if the user is already logged in
    if (req.session.username) {
        res.json({message: `Hi ${req.session.username}`, loggedIn: true});
    } else {
        res.json({loggedIn: false});
    }
    
});

//launch server
var server = protocol.createServer(options, app);
server.listen(port, () => {
    port === 443 ? console.log("HTTPS Server on https://duohando.com") : console.log(`HTTP server on http://localhost:${port}`);
});
