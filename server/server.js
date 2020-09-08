const greeting = require('../build/Release/greeting');

console.log(greeting.greetHello("Nick"));

//server dependencies
const express = require('express');
const https = require('https');
const httpsPort = 443;

//get OpenSSL credentials
const fs = require('fs');   // file system
const options = {
    key: fs.readFileSync(__dirname + "/ssl/privkey.pem"),
    cert: fs.readFileSync(__dirname + "/ssl/cert.pem")
}

//initialize express app
app = express();
app.enable('trust proxy');
//handler to inspect req.secure flag so we 
//can handle requests from https and http
app.use(function (req, res, next) {
    if (req.secure) {
        //request was https, so do no special handling
        next();
    } else {
        //request was http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
//response on homepage
var path = require('path');
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

//launch server
var httpsServer = https.createServer(options, app);
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS server listening on port: ${httpsPort}`);
    console.log('Proceed to https://duohando.com');
});
