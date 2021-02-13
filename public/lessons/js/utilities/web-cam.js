export class Webcam {
    static count = 1;
    template = `
    <div class="mySlides fade">
        <div class="webcam-container">
            <video class="webcam" autoplay></video>
            <button class="start">Start</button>
            <button class="stop">Stop</button>
        </div>
        <p class="wc-ASL-bank"></p>
    </div>`;
    answers;
    sendInterval;
    video;
    constructor(ASL, socket) {
        this.ASL = ASL;
        this.id = Webcam.count++;
        this.done = false;
        this.isStreaming = false;
        this.socket = socket;
    }

    setUp() {
        document.getElementsByClassName("wc-ASL-bank")[this.id-1].id = `wc-ASL-bank-${this.id}`;
        document.getElementById(`wc-ASL-bank-${this.id}`).innerHTML = this.ASL;
        let container = document.getElementsByClassName("webcam-container")[this.id-1];
        let that = this;

        //video setup
        this.video = container.querySelector(".webcam");
        var startButton = container.querySelector(".start");
        var stopButton = container.querySelector(".stop");

        startButton.addEventListener("click", function() { that.start(); })
        stopButton.addEventListener("click", function() { that.stop(); });
    }
    #hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    #getFrame() {
        let that = this;
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        canvas.getContext('2d').drawImage(this.video, 0, 0);
        canvas.toBlob(function(blob) {
            that.socket.emit('asl-frame', blob); //use blob instead of base64 because there is less wasted space
        }, 'image/jpeg', 1.0);
    }

    start() {
        let that = this;
        if (!this.isStreaming) {
            if (this.#hasGetUserMedia()) {
                navigator.mediaDevices.getUserMedia({video: {width: 320, height: 240}})  //only get video
                    .then((stream) => { 
                        this.video.srcObject = stream;
                        this.sendInterval = setInterval(function() {
                            that.#getFrame();
                        }, 1000/3 ); //3 fps
                        this.isStreaming = true;
                    });
            } else {
                alert("getUserMedia() is not supported by your browser");
            }
        }
    
        
    }
    
    stop() {
        if (this.isStreaming) {
            const stream = this.video.srcObject;
            const tracks = stream.getTracks();
        
            tracks.forEach(function(track) {
                track.stop();
            });
        
            this.video.srcObject = null;
            this.isStreaming = false;
            clearInterval(this.sendInterval);
        }
    }
}