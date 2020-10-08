//server dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

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
        key: fs.readFileSync(__dirname + "/ssl/privkey.pem"),
        cert: fs.readFileSync(__dirname + "/ssl/cert.pem")
    }
} catch (e) {
    //change to HTTP connection
    protocol = require('http');
    port = 3000;
}

//initialize express app
const app = express();
//serve public directory to client
app.use(express.static(path.join(__dirname, '../public')));
//use helmet as middleware
app.use(helmet());
//body parser middleware for html form handling
app.use(bodyParser.urlencoded({extended: true}));

app.enable('trust proxy');

//response on homepage
app.get('/', function(req, res) {
    console.log("Someone is at the homepage");
});
//login post from client
app.post('/login', function(req, res) {
    res.send(`You sent the following: ${req.body.email}.`);
    console.log(req.body.password);
});

//launch server
var server = protocol.createServer(options, app);
server.listen(port, () => {
    port === 443 ? console.log("HTTPS Server on https://duohando.com") : console.log(`HTTP server on localhost:${port}`);
});
