export class DragDropQuestions {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="ddq-ASL-bank"></div>
            <div class="ddq-ASL-answer-bank"></div>
        </div>
    </div>`;
    private files: string[] = [];
    private answers: any;
    private ASL: string[];
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
        this.id = DragDropQuestions.count++;
        this.done = false;
    }

    setUp(): Promise<void> {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName(`ddq-ASL-bank`)[this.id-1].id = `ddq-ASL-bank-${this.id}`;
            document.getElementsByClassName(`ddq-ASL-answer-bank`)[this.id-1].id = `ddq-ASL-answer-bank-${this.id}`;

            var ASL_bank = <HTMLElement>document.getElementsByClassName(`ddq-ASL-bank`)[this.id-1];
            var ASL_answer_bank = <HTMLElement>document.getElementsByClassName(`ddq-ASL-answer-bank`)[this.id-1];
            var that = this;
            //loading the assets
            var promises = [];
            for (let i = 0; i < this.ASL.length; i++) {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.files[i] = `../../../assets/Images/${this.ASL[i]}.mp4`;
                        resolve(true);
                    })
                );
            }
            Promise.all(promises).then(result => {
                console.log("DragDrop Questions Assets loaded!");
                //set innerHTMLs for both banks
                ASL_bank.innerHTML = this.buildHTML("bank");
                ASL_answer_bank.innerHTML = this.buildHTML("answers");

                this.plugAnswers(ASL_bank.querySelectorAll(".ddq-ASL-image"), ASL_answer_bank);
    
                this.answers = ASL_answer_bank.querySelectorAll(".ddq-ASL-bank-answer");
                this.answers_count = this.answers.length;
                
                //set up event listeners
                ASL_bank.ondrop = function(e: DragEvent) { that.drop(e); }
                ASL_bank.ondrag = function(e: DragEvent) { return false; }
                ASL_bank.ondragover = function(e: DragEvent) { that.allowDrop(e); }
                let temp1 = <NodeListOf<HTMLElement>>ASL_bank.querySelectorAll('.ddq-ASL-image');
                let temp2 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.ddq-ASL-image');
                let temp3 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.ddq-ASL-bank-answer');
                for (let i = 0; i < temp1.length; i++) { temp1[i].ondragstart = function(e: DragEvent) { that.drag(e); } }
                for (let i = 0; i < temp2.length; i++) { temp2[i].ondragstart = function(e: DragEvent) { that.drag(e); } }
                for (let i = 0; i < temp3.length; i++) { temp3[i].ondrop = function(e: DragEvent) { that.drop(e); }; temp3[i].ondragover = function(e) { that.allowDrop(e); } }
                return resolve();
            });
        })
    }
    
    private buildHTML(type: string): string {
        var html = "";
        if (type === "bank") {
            for (let i = 0; i < this.files.length; i++) {
                html += `
                <video class="ddq-ASL-image" id="ddq-${this.ASL[i]}" width="360" height="240" draggable="true" controls >
                    <source src="${this.files[i]}">>
                    Your browser doesn't support the displaying videos...
                </video>`;
            }
        } else if (type === "answers") {
            for (let i = 0; i < this.ASL.length; i++) {
                html += `<div class="ddq-ASL-bank-answer" id="ddq-box-${this.ASL[i]}" draggable="false"></div>`;
            }
        }
        return html;
    }
        
    private plugAnswers(bank: NodeListOf<HTMLElement>, answerBank: HTMLElement): void {
        if (this.ans !== null) {
            for (let i = 0; i < this.ans.length; i++) {
                for (let j = 0; j < bank.length; j++) {
                    let child = bank[j] as HTMLElement;
                    if (this.ans[i] === child?.id.split('-')[1]) {
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
        ev.dataTransfer?.setData("phrase", (ev.target as HTMLElement).id+","+((ev.target as HTMLElement).parentNode as HTMLElement).id);
    }
        
    private drop(ev: DragEvent) {
        ev.preventDefault();
        var data: string[] = [];
        if (ev.dataTransfer) {
            data = ev.dataTransfer.getData("phrase").split(",");    //[0] = dragged element's ID, [1] = dragged element's parent ID
        }
        
        var drag_target = document.getElementById(data[0]);         //what element is being dragged
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById((ev.target as HTMLElement).id);    //where the dragged element is going
    
        if (/ddq-box-[a-z]/.test((drop_target?.parentNode as HTMLElement).id)) {   //check if the drop target is an image inside an answer box
            this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
        } else if ((drop_target?.parentNode as HTMLElement).id === `ddq-ASL-answer-bank-${this.id}`) {   //check if the drop target is an answer box inside the answer bank
            var flags = (drop_target as HTMLElement).id.split("|");  //[0] = id, [1] = filled flag
            if (flags && flags[1] === "filled") {    //answer box is already filled
                this.swapElements((drag_target as HTMLElement), (drop_target?.childNodes[0] as HTMLElement), (drag_parent as HTMLElement));
            } else {    //answer box is empty
                if (drag_target !== null) {
                    (drop_target as HTMLElement).id = (drop_target as HTMLElement).id+"|filled";
                    (drop_target as HTMLElement).appendChild(drag_target);
                    if (/filled/.test((drag_parent as HTMLElement).id))  //reset parent id to not include 'filled'
                        (drag_parent as HTMLElement).id = (drag_parent as HTMLElement).id.substring(0, (drag_parent as HTMLElement).id.length-7);
                }
            }
        } else if ((drop_target?.parentNode as HTMLElement).id === `ddq-ASL-bank-${this.id}`) {  //check if the drop target is an image inside the bank
            if ((drag_parent as HTMLElement).id !== `ddq-ASL-bank-${this.id}`)
                this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
        } else if ((drop_target as HTMLElement).id === `ddq-ASL-bank-${this.id}`) {     //check if the drop target is the bank
            if ((drag_parent as HTMLElement).id !== `ddq-ASL-bank-${this.id}`) {    //do nothing if the drag parent and drop target are both the bank
                (drop_target as HTMLElement).appendChild((drag_target as HTMLElement));
                if (/filled/.test((drag_parent as HTMLElement).id))  //reset parent id to not include 'filled'
                    (drag_parent as HTMLElement).id = (drag_parent as HTMLElement).id.substring(0, (drag_parent as HTMLElement).id.length-7);
            }
        }
    
        this.checkAnswers();
    }
        
    private swapElements(drag: HTMLElement, drop: HTMLElement, parent: HTMLElement) {
        var temp = (drop.parentNode as HTMLElement).id;
        parent.appendChild(drop);
        document.getElementById(temp)?.appendChild(drag);
    }
    
    private checkAnswers() {
        this.answers_correct = 0;
        let sendAnswers: string[] = [];
        
        for (let i = 0; i < this.answers.length; i++) {
            let child = this.answers[i].childNodes[0];
            if(this.answers[i].id.split('-')[2].split('|')[0] === child?.id.split('-')[1]) this.answers_correct++;

            let temp = child?.id.charAt(3);
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "DragDropQuestions", id: this.ans_id, answers: sendAnswers});
    }
}