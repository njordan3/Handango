//server dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

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
    res.json({username: req.body.email});
});

app.get('/login', function(req, res) {
    //check if the user is already logged in
    res.json({message: "hi"});
});

//launch server
var server = protocol.createServer(options, app);
server.listen(port, () => {
    port === 443 ? console.log("HTTPS Server on https://duohando.com") : console.log(`HTTP server on http://localhost:${port}`);
});
