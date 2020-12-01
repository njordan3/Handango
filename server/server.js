//https://medium.com/@alexcambose/webcam-live-streaming-with-websockets-and-base64-64b1b4992db8
//Websocket/socketio with NodeJS/Express
//https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

//server dependencies
const express = require('express');
const WebSocket = require('ws');
//user authentication and database configuration
const passport = require('passport');
require('./passport-setup')(passport);

const fs = require('fs');

var tls = {};
var protocol = require('https');
var port = 443;
try {
    //get OpenSSL credentials
    tls = {
        key: fs.readFileSync(__dirname + "/tls/privkey.pem"),
        cert: fs.readFileSync(__dirname + "/tls/cert.pem")
    };
} catch (e) {
    protocol = require('http');
    port = 3000;
}

//initialize express app with middleware
const app = express();
let {initMiddleware} = require('./middleware');
initMiddleware(express, app, passport);

//load routes with our app and configured passport
let {initDashboardRoutes} = require('./dashboard');
initDashboardRoutes(app, passport);
let {initLoginRoutes} = require('./login');
initLoginRoutes(app, passport);
let {initSecurityRoutes} = require('./security');
initSecurityRoutes(app, passport);

//launch web server
const server = protocol.createServer(tls, app);

//launch websocket server by sharing our web server protocol and only accept connections coming from 'path'
const ws_server = new WebSocket.Server({server: server, path: ""});
ws_server.on('connection', function connection(socket) {
    socket.on('test', function incoming(msg) {
        console.log(msg);
    });
});

server.listen(port, () => {
    port === 443 ? console.log("HTTPS Server on https://duohando.com") : console.log(`HTTP server on localhost:${port}`);
});