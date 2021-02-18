export class FingerSpelling {
    static count = 1;
    static ASL = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="fs-ASL-bank"></div>
            <div class="fs-ASL-answer-bank"></div>
        </div>
    </div>`;
    private images: HTMLImageElement[] = [];
    private answers: any;
    private phrase: string[];
    private id: number;
    done: boolean;
    constructor(phrase: string[]) {
        this.phrase = phrase;
        this.id = FingerSpelling.count++;
        this.done = false;
    }

    setUp(): Promise<void> {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName(`fs-ASL-bank`)[this.id-1].id = `fs-ASL-bank-${this.id}`;
            document.getElementsByClassName(`fs-ASL-answer-bank`)[this.id-1].id = `fs-ASL-answer-bank-${this.id}`;

            var ASL_answer_bank = <HTMLElement>document.getElementsByClassName(`fs-ASL-answer-bank`)[this.id-1];
            var that = this;
        
            //loading the assets
            var promises = [];
            for (let i = 0; i < FingerSpelling.ASL.length; i++) {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.images.push(new Image());
                        this.images[i].src = `../../../assets/Images/${FingerSpelling.ASL[i]}.png`
                        this.images[i].onload = function() {
                            resolve(true);
                        }
                    })
                );
            }
            Promise.all(promises).then(result => {
                console.log("Finger Spelling ASL Assets loaded!");
        
                //build answer bank
                ASL_answer_bank.innerHTML = this.buildHTML("answers");
                ASL_answer_bank.ondrop = function(e: DragEvent) { that.drop(e); }
                ASL_answer_bank.ondragover = function(e: DragEvent) { that.allowDrop(e); }
        
                //build ASL bank with images
                this.resetASLBank();
        
                //get answer boxes
                this.answers = ASL_answer_bank.querySelectorAll(".fs-ASL-bank-answer");
                return resolve();
            });
        });
    }

    private buildHTML(type: string): string {
        var html: string = "";
        //fill out ASL bank
        if (type === "bank") {
            for (let i = 0; i < this.images.length; i++) {
                if (document.getElementById(`fs-${FingerSpelling.ASL[i]}`) === null) {
                    html += `<img class="fs-ASL-image" id="fs-${FingerSpelling.ASL[i]}" src="${this.images[i].src}" draggable="true">`;
                } else {
                    let count = 1;
                    while(document.getElementById(`fs-${FingerSpelling.ASL[i]}${count}`) !== null) { count++; }
                    html += `<img class="fs-ASL-image" id="fs-${FingerSpelling.ASL[i]}${count}" src="${this.images[i].src}" draggable="true">`;
                }
                
            }
        //fill out answer bank
        } else if (type === "answers") {
            let duplicates: any;
            for (let i = 0; i < this.phrase.length; i++) {
                for (let j = 0; j < this.phrase[i].length; j++) {
                    let id = "";
                    if (document.getElementById(`fs-box${this.phrase[i][j]}`) !== null) {
                        if (duplicates[this.phrase[i][j]] === undefined) {
                            duplicates[this.phrase[i][j]] = {count: 1};
                        } else {
                            duplicates[this.phrase[i][j]].count++;
                        }
                        id = `${this.phrase[i][j]}${duplicates[this.phrase[i][j]].count}`;
                    } else {
                        id = this.phrase[i][j];
                    }
                    html += `<div class="fs-ASL-bank-answer" id="fs-box${id}"></div>`;
                }
                html += `<div class="break"></div>`;
            }
        }
        return html;
    }

    private resetASLBank() {
        let that = this;
        let ASL_bank = <HTMLElement>document.getElementsByClassName(`fs-ASL-bank`)[this.id-1];
        let ASL_answer_bank = <HTMLElement>document.getElementsByClassName(`fs-ASL-answer-bank`)[this.id-1];
        ASL_bank.innerHTML = "";
        ASL_bank.innerHTML = this.buildHTML("bank");
        ASL_bank.ondrop = function(e: DragEvent) { that.drop(e); }
        ASL_bank.ondragover = function(e: DragEvent) { that.allowDrop(e); }

        let temp1 = <NodeListOf<HTMLElement>>ASL_bank.querySelectorAll('.fs-ASL-image');
        let temp2 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.fs-ASL-image');
        for(let i = 0; i < temp1.length; i++) { temp1[i].ondragstart = function(e: DragEvent) { that.drag(e); }; temp1[i].style.width = "auto"; temp1[i].style.height = "100px"; }
        for(let i = 0; i < temp2.length; i++) { temp2[i].ondragstart = function(e: DragEvent) { that.drag(e); }; temp2[i].style.width = "auto"; temp2[i].style.height = "100px"; }
        //resize images to fit better on screen
    }

    private allowDrop(ev: DragEvent) {
        ev.preventDefault();
    }
    
    private drag(ev: DragEvent) {
        ev.dataTransfer?.setData("phrase", (ev.target as HTMLElement).id+","+((ev.target as HTMLElement).parentNode as HTMLElement).id);
    }

    private drop(ev: DragEvent) {
        ev.preventDefault();
        var data: string[] = [];
        if (ev.dataTransfer) {
            data = ev.dataTransfer.getData("phrase").split(","); //[0] = dragged element's ID, [1] = dragged element's parent ID
        }
        var drag_target = document.getElementById(data[0]);         //what element is being dragged
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById((ev.target as HTMLElement).id);    //where the dragged element is going

        if (/fs-box/.test((drop_target?.parentNode as HTMLElement).id)) {   //check if the drop target is an image inside an answer box
            this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
            (drag_target?.parentNode as HTMLElement).style.width = (drag_target as HTMLElement).style.width;
        } else if ((drop_target?.parentNode as HTMLElement).id === `fs-ASL-answer-bank-${this.id}`) {   //check if the drop target is an answer box inside the answer bank
            var flags = drop_target?.id.split("|");  //[0] = id, [1] = filled flag
            if (flags && flags[1] === "filled") {    //answer box is already filled
                this.swapElements((drag_target as HTMLElement), (drop_target?.childNodes[0] as HTMLElement), (drag_parent as HTMLElement));
                (drag_target?.parentNode as HTMLElement).style.width = (drag_target as HTMLElement).style.width;
            } else {    //answer box is empty
                if (drag_target !== null) {
                    (drop_target as HTMLElement).id = (drop_target as HTMLElement).id+"|filled";
                    (drop_target as HTMLElement).appendChild(drag_target);
                    if (/filled/.test((drag_parent as HTMLElement).id)) {  //reset parent id to not include 'filled'
                        (drag_parent as HTMLElement).id = (drag_parent as HTMLElement).id.substring(0, (drag_parent as HTMLElement).id.length-7);
                    }
                    (drag_target.parentNode as HTMLElement).style.width = drag_target.style.width;
                }
            }
        } else if ((drop_target?.parentNode as HTMLElement).id === `fs-ASL-bank-${this.id}`) {  //check if the drop target is an image inside the bank
            if ((drag_parent as HTMLElement).id !== `fs-ASL-bank-${this.id}`)
                this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
        } else if (drop_target?.id === `fs-ASL-bank-${this.id}`) {     //check if the drop target is the bank
            if ((drag_parent as HTMLElement).id !== `fs-ASL-bank-${this.id}`) {    //do nothing if the drag parent and drop target are both the bank
                drop_target.appendChild((drag_target as HTMLElement));
                if (/filled/.test((drag_parent as HTMLElement).id))  //reset parent id to not include 'filled'
                    (drag_parent as HTMLElement).id = (drag_parent as HTMLElement).id.substring(0, (drag_parent as HTMLElement).id.length-7);
            }
        }
        this.resetASLBank();
        this.checkAnswers();
    }

    private swapElements(drag: HTMLElement, drop: HTMLElement, parent: HTMLElement) {
        var temp = (drop.parentNode as HTMLElement).id;
        parent.appendChild(drop);
        document.getElementById(temp)?.appendChild(drag);
    }

    private checkAnswers() {
        let letters_correct = 0;
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i].id.charAt(6).toUpperCase() === this.answers[i].childNodes[0]?.id.charAt(3)) {
                letters_correct++;
            }
        }
        this.done = (letters_correct === this.answers.length);
        console.log(this.done);
    }
}