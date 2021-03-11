export class FingerSpellingInterpNumbers {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="fsin-ASL-bank"></div>
            <div class="fsin-ASL-answer-bank"></div>
        </div>
    </div>`;
    private images: any = {};
    private answers: any;
    private phrase: string[];
    private files: string[][] = [];
    private ans: string[]|null;
    private ans_id: number|null;
    private socket: any;
    private id: number;
    done: boolean;
    answers_correct: number = 0;
    answers_count: number = 0;
    setAnswer: Function|null;
    constructor(phrase: string[], ans: string[]|null = null, ans_id: number|null = null, setAnswer: Function|null = null) {
        this.phrase = phrase;
        this.ans = ans;
        this.ans_id = ans_id;
        this.setAnswer = setAnswer;
        this.id = FingerSpellingInterpNumbers.count++;
        this.done = false;
    }

    setUp() {
        var promises = [];
        for (let i = 0; i < this.phrase.length; i++) {
            let num = parseInt(this.phrase[i]);

            this.files[i] = [];

            if( num > 999999 ) {    // add images for numbers in the millions
                this.files[i] = this.numberToImages( Math.floor( num / 1000000 ) );
                this.files[i].push(`../../../assets/Images/1000000a.jpg`);
                this.files[i].push(`../../../assets/Images/1000000b.jpg`);
                this.files[i].push(`../../../assets/Images/1000000c.jpg`);
                this.files[i].push(`../../../assets/Images/1000000d.jpg`);
                this.files[i].push(`../../../assets/Images/1000000e.jpg`);
                num = Math.floor( num % 1000000 );
            }
            if( num > 999 ) {   // add images for numbers in the thousands
                this.files[i] = this.files[i].concat(this.numberToImages( Math.floor( num / 1000 ) ));
                this.files[i].push(`../../../assets/Images/1000b.jpg`);
                num = Math.floor( num % 1000 );
            }					
            if( num > 0 ) { // add images for numbers less than 1000
                this.files[i] = this.files[i].concat(this.numberToImages( num ));
            } else if ( this.files[i].length == 0 ) {
                this.files[i].push(`../../../assets/Images/0.jpg`);
            }
            let temp = this.files[i].slice(0);  //assign temp by value instead of reference

            for (let j = 0; j < temp.length; j++) {
                let step: any = temp[j].split('/');
                step = step[step.length-1].split('.')[0];
                if (step.charAt(step.length-1) === 'a') {
                    temp = [step.slice(0, -1)];
                    break;
                }
                if (step.charAt(1) === 'R' || step.charAt(step.length-1) === 'b') {
                    step = step.slice(0, -1);
                }
                temp[j] = step;
            }

            //loading the assets
            promises.push(
                new Promise((resolve, reject) => {
                    let key = this.getKey(this.files[i][0]);
                    this.images[key] = new Array<HTMLImageElement>();
                    for (let j = 0; j < this.files[i].length; j++) {
                        this.images[key].push(new Image());
                        this.images[key][j].src = this.files[i][j];
                        this.images[key][j].onload = function() {
                            resolve(true);
                        }
                    }
                })
            );
        }
        
        Promise.all(promises).then(result => {
            console.log("Finger Spelling Interpretation Numbers ASL Assets loaded!");

            document.getElementsByClassName(`fsin-ASL-bank`)[this.id-1].id = `fsin-ASL-bank-${this.id}`;
            document.getElementsByClassName(`fsin-ASL-answer-bank`)[this.id-1].id = `fsin-ASL-answer-bank-${this.id}`;

            var ASL_bank = <HTMLElement>document.getElementById(`fsin-ASL-bank-${this.id}`);
            var ASL_answer_bank = <HTMLElement>document.getElementById(`fsin-ASL-answer-bank-${this.id}`);
            let that = this;

            //build answer bank
            ASL_answer_bank.innerHTML = this.buildHTML("answers");

            //build ASL bank with images
            ASL_bank.innerHTML = this.buildHTML("bank");

            this.plugAnswers(<NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll(".fsin-ASL-bank-answer"));

            //get answer boxes
            this.answers = ASL_answer_bank.querySelectorAll(".fsin-ASL-bank-answer");
            this.answers_count = this.answers.length;

            for (let i = 0; i < this.answers.length; i++) {
                this.answers[i].addEventListener('input', function() { that.checkAnswers(); });
                
                let temp1 = <NodeListOf<HTMLElement>>ASL_bank.querySelectorAll('.fsin-ASL-image-box');
                let button = (temp1[i].getElementsByClassName('fsin-play')[0] as HTMLElement)
                if (button) {
                    button.onclick = function(e: Event) {
                        let imgBox = ((e.target as HTMLElement).parentNode as HTMLElement);
                        let frames = imgBox.getElementsByClassName('fsin-ASL-image');
                        let text = (imgBox.getElementsByClassName('fsin-text-overlay')[0] as HTMLElement);
                        (frames[0] as HTMLElement).style.opacity = "1.0";
                        text.style.display = "none";
                        update_image(0);
                        function update_image(frame: number) {
                            if(frame < frames.length) {
                                if (frame > 0) (frames[frame-1] as HTMLElement).style.display = "none";
                                (frames[frame] as HTMLElement).style.display = "block";
                                setTimeout(function() { update_image(frame+1); }, 666);
                            } else { // Done displaying frames
                                (frames[frames.length-1] as HTMLElement).style.display = "none";
                                (frames[0] as HTMLElement).style.display = "block";
                                (frames[0] as HTMLElement).style.opacity = "0.5";
                                text.style.display = "block";
                            }
                        }
                    }
                }
            }
        });
    }

    private getKey(element: string): string {
        let key = "";
        if (element === "c100") {
            key = "c100";
        } else if (element.length > 1) {
            key = element.slice(0, -1);
        } else {
            key = element;
        }
        return key;
    }

    private buildHTML(type: string) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            for (let i = 0; i < this.files.length; i++) {
                let key = this.getKey(this.files[i][0]);
                if (document.getElementById(`fsin-img-box-${key}`) === null) {
                    html += `<div class="fsin-ASL-image-box" id="fsin-img-box-${key}">`;
                    let j = 0;
                    for (j = 0; j < this.files[i].length; j++) {
                        if (document.getElementById(`fsin-img-${key}|${j}`) === null) {
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="fsin-ASL-image" id="fsin-img-${key}|${j}" src="${this.images[key][j].src}">`;
                        } else {
                            let count = 1;
                            while(document.getElementById(`fsin-img-${key}|${j}-${count}`) !== null) { count++; }
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="fsin-ASL-image" id="fsin-img-${key}|${j}-${count}" src="${this.images[key][j].src}">`;
                        }
                    }
                    if (j > 1) {
                        html += `<button class="fsin-play" id="fsin-playbtn-${key}">Play</button><p class="fsin-text-overlay"><b>Replay?</b></p></div>`;
                    } else {
                        html += `</div>`;
                    }
                } else {
                    let count = 1;
                    while(document.getElementById(`fsin-img-box-${key}-${count}`) !== null) { count++; }
                    html += `<div class="fsin-ASL-image-box" id="fsin-img-box-${key}-${count}">`;
                    let j = 0;
                    for (j = 0; j < this.images[key].length; j++) {
                        if (document.getElementById(`fsin-img-${key}|${j}`) === null) {
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="fsin-ASL-image" id="fsin-img-${key}|${j}" src="${this.images[key][j].src}">`;
                        } else {
                            let count2 = 1;
                            while(document.getElementById(`fsin-img-${key}|${j}-${count2}`) !== null) { count2++; }
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="fsin-ASL-image" id="fsin-img-${key}|${j}-${count2}" src="${this.images[key][j].src}">`;
                        }
                    }
                    if (j > 1) {
                        html += `<button class="fsin-play" id="fsin-playbtn-${key}-${count}">Play</button><p class="fsin-text-overlay"><b>Replay?</b></p></div>`;
                    } else {
                        html += `</div>`;
                    }
                }
            }
        //fill out answer bank
        } else if (type === "answers") {
            for (let i = 0; i < this.phrase.length; i++) {
                html += `<label for="fsin-text${i}">Number ${i+1}:</label><input type="text" autocomplete="off" class="fsin-ASL-bank-answer" id="fsin-text${i}-${this.phrase[i]}"></input><div class="break"></div>`;
            }
        }
        return html;
    }

    private plugAnswers(answerBank: NodeListOf<HTMLElement>): void {
        if (this.ans !== null) {
            for (let i = 0; i < answerBank.length; i++) {
                (answerBank[i] as HTMLInputElement).value = this.ans[i];
            }
        }
    }

    private checkAnswers() {
        this.answers_correct = 0;
        let sendAnswers: string[] = [];
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i].value === this.phrase[this.answers[i].id.charAt(9)]) this.answers_correct++;
            
            let temp = this.answers[i].value
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "FingerspellingInterpNumbers", id: this.ans_id, answers: sendAnswers});
    }

    private numberToImages(num: number ): string[] {
        var imageStrings: string[] = [];
        var count = 0;
    
        var hun;  // The hundreds digit
        var rest; // The tens and ones digits
        if( num > 99 ) {
            hun = Math.floor(num / 100);
            rest = Math.floor(num % 100);	
            if( (rest == 0) || (rest > 9) ) {   // even hundreds or 110-199, 210-299, 310-399 etc							   	 
                imageStrings[count++] = `../../../assets/Images/${hun}00a.jpg`;
                imageStrings[count++] = `../../../assets/Images/${hun}00b.jpg`;
                
                if( rest != 0 ) {
                    imageStrings = imageStrings.concat(this.numberToImages99( rest ));
                }
            } else {  // 101-109, 201-209, 301-309 etc
                imageStrings[count++] = `../../../assets/Images/${hun}.jpg`;
                if (( hun >= 2 ) && (hun <= 5 )) {
                    imageStrings[count++] = `../../../assets/Images/${hun}00b.jpg`;
                } else {
                    imageStrings[count++] = `../../../assets/Images/c100.jpg`;     
                }                                        
                imageStrings[count++] = `../../../assets/Images/0.jpg`;   
                imageStrings[count++] = `../../../assets/Images/${rest}.jpg`;
            }
        } else {
            imageStrings = imageStrings.concat(this.numberToImages99(num));
        }
    
        return imageStrings;
    }

    private numberToImages99(num: number): string[] {
        var imageStrings: string[] = [];
        var count = 0;
    
        var tens;
        var ones;
        if( num < 10 ) {
            imageStrings[count++] = `../../../assets/Images/${num}.jpg`;
        } else {
            if( (num < 24) || (num == 25) ) {   // 10-23 and 25 all have 4 image frames
                imageStrings[count++] = `../../../assets/Images/${num}a.jpg`;
                imageStrings[count++] = `../../../assets/Images/${num}b.jpg`;
                imageStrings[count++] = `../../../assets/Images/${num}c.jpg`;
                imageStrings[count++] = `../../../assets/Images/${num}d.jpg`;
            } else if( num < 30 ) { // 24 and 26-29 have 2 image frames
                imageStrings[count++] = `../../../assets/Images/${num}a.jpg`;
                imageStrings[count++] = `../../../assets/Images/${num}b.jpg`;
            } else {    // 30-99							   
                tens = Math.floor( num / 10 );
                ones = Math.floor( num % 10 );
                imageStrings[count++] = `../../../assets/Images/${tens}.jpg`;
                if( tens != ones ) {
                    imageStrings[count++] = `../../../assets/Images/${ones}.jpg`;
                } else {
                    imageStrings[count++] = `../../../assets/Images/${ones}R.jpg`;
                }							   	   
            }
        }
        
        return imageStrings;							   			
    }
}