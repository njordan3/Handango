export class DragDropNumbers {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="ddn-ASL-bank"></div>
            <div class="break"></div>
            <div class="ddn-ASL-answer-bank"></div>
        </div>
    </div>`;
    private images: any = {};
    private answers: any;
    private ASL: string[];
    private phraseSteps: string[][] = [];
    private files: string[][] = [];
    private ans: string[]|null;
    private ans_id: number|null;
    private socket: any;
    private id: number;
    done: boolean;
    answers_correct: number = 0;
    answers_count: number = 0;
    setAnswer: Function|null;
    constructor(ASL: string[], ans: string[]|null = null, ans_id: number|null = null, setAnswer: Function|null = null) {
        this.ASL = ASL;
        this.ans = ans;
        this.ans_id = ans_id;
        this.setAnswer = setAnswer;
        this.id = DragDropNumbers.count++;
        this.done = false;
    }

    setUp(): Promise<void> {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName(`ddn-ASL-bank`)[this.id-1].id = `ddn-ASL-bank-${this.id}`;
            document.getElementsByClassName(`ddn-ASL-answer-bank`)[this.id-1].id = `ddn-ASL-answer-bank-${this.id}`;

            var ASL_bank = <HTMLElement>document.getElementsByClassName(`ddn-ASL-bank`)[this.id-1];
            var ASL_answer_bank = <HTMLElement>document.getElementsByClassName(`ddn-ASL-answer-bank`)[this.id-1];
            var that = this;

            var promises = [];
            for (let i = 0; i < this.ASL.length; i++) {
                let num = parseInt(this.ASL[i]);

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
                this.phraseSteps[i] = temp;

                //loading the assets
                promises.push(
                    new Promise((resolve, reject) => {
                        let key = this.ASL[i];
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
                console.log("DragDrop Numbers Assets loaded!");

                //set innerHTMLs for both banks
                ASL_bank.innerHTML = this.buildHTML("bank");
                ASL_answer_bank.innerHTML = this.buildHTML("answers");

                this.plugAnswers(ASL_bank, ASL_answer_bank);
    
                this.answers = ASL_answer_bank.querySelectorAll(".ddn-ASL-bank-answer");
                this.answers_count = this.answers.length;
                
                //set up event listeners
                ASL_bank.ondrop = function(e: DragEvent) { that.drop(e); }
                ASL_bank.ondrag = function(e: DragEvent) { return false; }
                ASL_bank.ondragover = function(e: DragEvent) { that.allowDrop(e); }
                let temp1 = <NodeListOf<HTMLElement>>ASL_bank.querySelectorAll('.ddn-ASL-image-box');
                let temp2 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.ddn-ASL-image-box');
                let temp3 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.ddn-ASL-bank-answer');
                for(let i = 0; i < temp1.length; i++) { 
                    temp1[i].ondragstart = function(e: DragEvent) { that.drag(e); };
                    let button = (temp1[i].getElementsByClassName('ddn-play')[0] as HTMLElement)
                    if (button) {
                        button.onclick = function(e: Event) {
                            let imgBox = ((e.target as HTMLElement).parentNode as HTMLElement);
                            let frames = imgBox.getElementsByClassName('ddn-ASL-image');
                            let text = (imgBox.getElementsByClassName('ddn-text-overlay')[0] as HTMLElement);
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
                for(let i = 0; i < temp2.length; i++) { 
                    temp2[i].ondragstart = function(e: DragEvent) { that.drag(e); };
                    let button = (temp2[i].getElementsByClassName('ddn-play')[0] as HTMLElement);
                    if (button) {
                        button.onclick = function(e: Event) {
                            let imgBox = ((e.target as HTMLElement).parentNode as HTMLElement);
                            let frames = imgBox.getElementsByClassName('ddn-ASL-image');
                            let text = (imgBox.getElementsByClassName('ddn-text-overlay')[0] as HTMLElement);
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
                for (let i = 0; i < temp3.length; i++) { temp3[i].ondrop = function(e: DragEvent) { that.drop(e); }; temp3[i].ondragover = function(e) { that.allowDrop(e); } }

                return resolve();
            });
        })
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
    
    private buildHTML(type: string): string {
        var html = "";
        if (type === "bank") {
            for (let i = 0; i < this.files.length; i++) {
                let key = this.ASL[i];
                if (document.getElementById(`ddn-img-box-${key}`) === null) {
                    html += `<div class="ddn-ASL-image-box" id="ddn-img-box-${key}">`;
                    let j = 0;
                    for (j = 0; j < this.images[key].length; j++) {
                        if (document.getElementById(`ddn-img-${key}|${j}`) === null) {
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="ddn-ASL-image" id="ddn-img-${key}|${j}" src="${this.images[key][j].src}">`;
                        } else {
                            let count = 1;
                            while(document.getElementById(`ddn-img-${key}|${j}-${count}`) !== null) { count++; }
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="ddn-ASL-image" id="ddn-img-${key}|${j}-${count}" src="${this.images[key][j].src}">`;
                        }
                    }
                    if (j > 1) {
                        html += `<button class="ddn-play" id="ddn-playbtn-${key}">Play</button><p class="ddn-text-overlay"><b>Replay?</b></p></div>`;
                    } else {
                        html += `</div>`;
                    }
                } else {
                    let count = 1;
                    while(document.getElementById(`ddn-img-box-${key}-${count}`) !== null) { count++; }
                    html += `<div class="ddn-ASL-image-box" id="ddn-img-box-${key}-${count}">`;
                    let j = 0;
                    for (j = 0; j < this.images[key].length; j++) {
                        if (document.getElementById(`ddn-img-${key}|${j}`) === null) {
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="ddn-ASL-image" id="ddn-img-${key}|${j}" src="${this.images[key][j].src}">`;
                        } else {
                            let count2 = 1;
                            while(document.getElementById(`ddn-img-${key}|${j}-${count2}`) !== null) { count2++; }
                            html += `<img style="display: ${j === 0 ? "block" : "none"};" class="ddn-ASL-image" id="ddn-img-${key}|${j}-${count2}" src="${this.images[key][j].src}">`;
                        }
                    }
                    if (j > 1) {
                        html += `<button class="ddn-play" id="ddn-playbtn-${key}-${count}">Play</button><p class="ddn-text-overlay"><b>Replay?</b></p></div>`;
                    } else {
                        html += `</div>`;
                    }
                }
            }
        } else if (type === "answers") {
            let duplicates: any = {};
            for (let i = 0; i < this.ASL.length; i++) {
                let id = "";
                let step = this.ASL[i];
                if (document.getElementById(`ddn-box-${step}`) !== null) {
                    if (duplicates[step] === undefined) {
                        let count = 1;
                        while (document.getElementById(`ddn-box-${step}-${count}`) !== null) { count++; }
                        duplicates[step] = {count: count};
                        id = `${step}-${duplicates[step].count}`;
                    } else {
                        id = `${step}-${duplicates[step].count}`;
                        duplicates[step].count++;
                    }
                } else {
                    if (duplicates[step] === undefined) {
                        duplicates[step] = {count: 1};
                        id = step;
                    } else {
                        id = `${step}-${duplicates[step].count}`;
                        duplicates[step].count++;
                    }
                }
                html += `<div class="ddn-ASL-bank-answer" id="ddn-box-${id}"></div>`;
            }
        }

        return html;
    }
        
    private plugAnswers(bank: HTMLElement, answerBank: HTMLElement): void {
        if (this.ans !== null) {
            for (let i = 0; i < this.ans.length; i++) {
                for (let j = 0; j < bank.childNodes.length; j++) {
                    let child = bank.childNodes[j] as HTMLElement;
                    if (this.ans[i] === child.id.split('-')[3]) {
                        answerBank.childNodes[i].appendChild(child);
                    }
                }
            }
        }
    }

    private allowDrop(ev: DragEvent) {
        ev.preventDefault();
    }
            
    private drag(ev: DragEvent) {
        ev.dataTransfer?.setData("ASL", (ev.target as HTMLElement).id+","+((ev.target as HTMLElement).parentNode as HTMLElement).id);
    }
        
    private drop(ev: DragEvent) {
        ev.preventDefault();
        var data: string[] = [];
        if (ev.dataTransfer) {
            data = ev.dataTransfer.getData("ASL").split(",");    //[0] = dragged element's ID, [1] = dragged element's parent ID
        }
        
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById((ev.target as HTMLElement).id);    //where the dragged element is going
    
        if ((drop_target as HTMLElement).id === `ddn-ASL-bank-${this.id}`) { //drop target is bank
            if (!/ddn-ASL-bank/.test((drag_parent?.parentNode as HTMLElement).id) || !/ddn-ASL-bank/.test((drop_target as HTMLElement).id)) {
                if (/ddn-ASL-bank/.test((drop_target as HTMLElement).id)) {
                    if (/filled/.test((drag_parent?.parentNode as HTMLElement).id)) {  //reset parent id to not include 'filled'
                        (drag_parent?.parentNode as HTMLElement).id = (drag_parent?.parentNode as HTMLElement).id.substring(0, (drag_parent?.parentNode as HTMLElement).id.length-7);
                    }
                    drop_target?.appendChild(drag_parent as HTMLElement);
                } else {
                    this.swapElements(drag_parent as HTMLElement, drop_target?.parentNode as HTMLElement);
                }
            } else {
                return;
            }
        } else if (/ddn-img-box/.test((drop_target as HTMLElement).id)) {   //drop target is image box
            if (!/ddn-ASL-bank/.test((drag_parent?.parentNode as HTMLElement).id) || !/ddn-ASL-bank/.test((drop_target?.parentNode as HTMLElement).id)) {
                if (/ddn-ASL-bank/.test((drop_target?.parentNode as HTMLElement).id)) {
                    if (/filled/.test((drag_parent?.parentNode as HTMLElement).id)) {  //reset parent id to not include 'filled'
                        (drag_parent?.parentNode as HTMLElement).id = (drag_parent?.parentNode as HTMLElement).id.substring(0, (drag_parent?.parentNode as HTMLElement).id.length-7);
                    }
                    drop_target?.parentNode?.appendChild(drag_parent as HTMLElement);
                } else {
                    this.swapElements(drag_parent as HTMLElement, drop_target as HTMLElement);
                }
            } else {
                return;
            }
        } else if (/ddn-img/.test((drop_target as HTMLElement).id)) {   //drop target is image
            if (!/ddn-ASL-bank/.test((drag_parent?.parentNode as HTMLElement).id) || !/ddn-ASL-bank/.test((drop_target?.parentNode?.parentNode as HTMLElement).id)) {
                if (/ddn-ASL-bank/.test((drop_target?.parentNode?.parentNode as HTMLElement).id)) {
                    if (/filled/.test((drag_parent?.parentNode as HTMLElement).id)) {  //reset parent id to not include 'filled'
                        (drag_parent?.parentNode as HTMLElement).id = (drag_parent?.parentNode as HTMLElement).id.substring(0, (drag_parent?.parentNode as HTMLElement).id.length-7);
                    }
                    drop_target?.parentNode?.parentNode?.appendChild(drag_parent as HTMLElement);
                } else {
                    this.swapElements(drag_parent as HTMLElement, drop_target?.parentNode as HTMLElement);
                }
            } else {
                return;
            }
        } else if (/ddn-box/.test((drop_target as HTMLElement).id)) {  //drop target is answer box
            var flags = drop_target?.id.split("|");  //[0] = id, [1] = filled flag
            if (flags && flags[1] === "filled") {    //answer box is already filled
                this.swapElements((drag_parent as HTMLElement), (drop_target?.childNodes[0] as HTMLElement));
                //(drag_target?.parentNode as HTMLElement).style.width = (drag_target as HTMLElement).style.width;
            } else {    //answer box is empty
                if (drag_parent !== null) {
                    (drop_target as HTMLElement).id = (drop_target as HTMLElement).id+"|filled";
                    if (/filled/.test((drag_parent?.parentNode as HTMLElement).id)) {  //reset parent id to not include 'filled'
                        (drag_parent?.parentNode as HTMLElement).id = (drag_parent?.parentNode as HTMLElement).id.substring(0, (drag_parent?.parentNode as HTMLElement).id.length-7);
                    }
                    (drop_target as HTMLElement).appendChild(drag_parent);
                }
            }
        } else {
            return;
        }
        
        this.checkAnswers();
    }
        
    private swapElements(drag: HTMLElement, drop: HTMLElement) {
        var temp = (drop.parentNode as HTMLElement).id;
        drag?.parentNode?.appendChild(drop as HTMLElement);
        document.getElementById(temp)?.appendChild(drag as HTMLElement);
    }
    
    private checkAnswers() {
        this.answers_correct = 0;
        let sendAnswers: string[] = [];
        for (let i = 0; i < this.answers.length; i++) {
            let child = this.answers[i].childNodes[0];
            if(this.answers[i].id.split('-')[2].split('|')[0] === child?.id.split('-')[3]) this.answers_correct++;

            let temp = child?.id.charAt(3);
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "DragDropNumbers", id: this.ans_id, answers: sendAnswers});
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