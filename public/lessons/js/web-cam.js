import * as main from './main.js';

export {
    setUp as setUp,
    stop as stop,
    done as done
}

var video = document.querySelector("video");

var done = true;
var isStreaming = false;
var sendInterval;

function setUp(ASL) {
    document.getElementById("wc-ASL-bank").innerHTML = ASL;

    var startButton = document.getElementById("start");
    var stopButton = document.getElementById("stop");
    startButton.addEventListener("click", function() { start(); })
    stopButton.addEventListener("click", function() { stop(); });
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function getFrame(socket) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(function(blob) {
        socket.emit('asl-frame', blob); //use blob instead of base64 because there is less wasted space
    }, 'image/jpeg', 1.0);
}

function start() {
    if (!isStreaming) {
        if (hasGetUserMedia()) {
            navigator.mediaDevices.getUserMedia({video: {width: 320, height: 240}})  //only get video
                .then((stream) => { 
                    video.srcObject = stream;
                    sendInterval = setInterval(function() {
                        getFrame(main.socket);
                    }, 10000 ); //3 fps
                    isStreaming = true;
                });
        } else {
            alert("getUserMedia() is not supported by your browser");
        }
    }

    
}

function stop() {
    if (isStreaming) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
    
        tracks.forEach(function(track) {
            track.stop();
        });
    
        video.srcObject = null;
        isStreaming = false;
        clearInterval(sendInterval);
    }
}