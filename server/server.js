//https://medium.com/@technologies4.trending/password-encryption-using-mysql-database-in-node-js-30f736ea1de8
//https://medium.com/@alexcambose/webcam-live-streaming-with-websockets-and-base64-64b1b4992db8
//Websocket/socketio with NodeJS/Express
//https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

const greeting = require('../build/Release/greeting');

console.log(greeting.greetHello("Nick"));

//server dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
//const https = require('https');
const { v4: uuidv4 } = require('uuid'); //random string generator
const session = require('express-session');
//https://www.npmjs.com/package/express-mysql-session
const filestore = require('session-file-store')(session);

//used to create file path strings
const path = require('path');
// file system
const fs = require('fs');

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
    protocol = require('http');
    port = 3000;
}

//initialize express app
const app = express();
//serve public directory to client
//https://stackoverflow.com/questions/11569181/serve-static-files-on-a-dynamic-route-using-express
app.use(express.static(path.join(__dirname, '../public')));
//use helmet as middleware
app.use(helmet());
//body parser middleware for html form handling
app.use(bodyParser.urlencoded({extended: true}));

//use session middleware with unique session id using UUIDV4
app.use(session({
    genid: () => {
        return uuidv4();
    },
    store: new filestore(),
    secret: 'super secret',
    resave: false,
    saveUninitialized: true
}))

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
