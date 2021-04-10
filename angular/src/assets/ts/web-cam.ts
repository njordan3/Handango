export class Webcam {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="webcam-container">
            <video class="webcam" autoplay></video>
            <div class="row">
                <div class="col">
                    <div>
                        <button type="button" style="" class="btn btn-success start">Start Camera</button>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <button style="" type= "button" class="btn btn-danger stop">Stop Camera</button>
                    </div>
                </div>
                <div class="col snap" style="display: none">
                    <div>
                        <button style="background-color: #04204e;" type="button" class="btn"><span style="color: white">Snap</span></button>
                    </div>
                </div>
            </div>
        </div>
        <p class="wc-ASL-bank"></p>
        <p class="wc-ASL-prediction"></p>
    </div>`;
    private video: any;
    private socket: any;
    private ASL: string;
    private ans: string[]|null;
    private ans_id: number|null;
    private id: number;
    private isStreaming: boolean;
    answer_correct: boolean = false;
    pauseTimer: Function|null;
    startTimer: Function|null;
    constructor(ASL: string, socket: any, ans: string[]|null = null, ans_id: number|null = null, pauseTimer: Function|null = null, startTimer: Function|null = null) {
        this.ASL = ASL;
        this.ans = ans;
        this.ans_id = ans_id;
        this.id = Webcam.count++;
        this.isStreaming = false;
        this.socket = socket;
        this.pauseTimer = pauseTimer;
        this.startTimer = startTimer;
    }

    setUp(): Promise<void> {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName("wc-ASL-bank")[this.id-1].id = `wc-ASL-bank-${this.id}`;
            let ASL_bank = document.getElementById(`wc-ASL-bank-${this.id}`);
            if (ASL_bank) ASL_bank.innerHTML = this.ASL;
            let container = document.getElementsByClassName("webcam-container")[this.id-1];
            let that = this;

            //video setup
            this.video = container.querySelector(".webcam");
            var startButton = container.querySelector(".start");
            var stopButton = container.querySelector(".stop");
            var snapButton = container.querySelector(".snap");

            startButton?.addEventListener("click", function() { that.start(); })
            stopButton?.addEventListener("click", function() { that.stop(); });
            snapButton?.addEventListener("click", function() { that.getFrame(); });

            that.socket.on('asl-prediction', function(letter: string) {
                console.log(document.getElementsByClassName('wc-ASL-prediction')[that.id-1], letter)
                document.getElementsByClassName('wc-ASL-prediction')[that.id-1].innerHTML = `Prediction: ${letter}`;
            });

            resolve();
        });
    }
    private hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    private getFrame() {
        if (this.isStreaming) {
            let that = this;
            const canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            canvas.getContext('2d')?.drawImage(this.video, 0, 0);
            canvas.toBlob(function(blob) {
                that.socket.emit('asl-frame', blob); //use blob instead of base64 because there is less wasted space
            }, 'image/jpeg', 1.0);
        }
    }

    start() {
        let that = this;
        if (!this.isStreaming) {
            if (this.hasGetUserMedia()) {
                if (this.pauseTimer !== null) this.pauseTimer();
                navigator.mediaDevices.getUserMedia({video: {width: 320, height: 240}})  //only get video
                    .then((stream) => { 
                        this.video.srcObject = stream;
                        (document.getElementsByClassName("webcam-container")[this.id-1].querySelector(".snap") as HTMLElement).style.display = "block";
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
        
            tracks.forEach(function(track: any) {
                track.stop();
            });
        
            this.video.srcObject = null;
            (document.getElementsByClassName("webcam-container")[this.id-1].querySelector(".snap") as HTMLElement).style.display = "none";
            this.isStreaming = false;
            if (this.startTimer) this.startTimer();
        }
    }
}