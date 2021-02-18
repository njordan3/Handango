export class DragDrop {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="dd-ASL-bank"></div>
            <div class="dd-ASL-answer-bank"></div>
        </div>
    </div>`;
    
    private images: HTMLImageElement[] = [];
    private answers: any;
    private ASL: string[];
    private id: number;
    done: boolean;
    constructor(ASL: string[]) {
        this.ASL = ASL;
        this.id = DragDrop.count++;
        this.done = false;
    }

    build(): Promise<string> {
        return new Promise((resolve, reject) => {

            let htmlCode: string = `<div class="mySlides"><div class="slide"><div class="dd-ASL-bank">`;

            //loading the assets
            var promises: Promise<boolean>[] = [];
            for (let i = 0; i < this.ASL.length; i++) {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.images.push(new Image());
                        this.images[i].src = `../../../assets/Images/${this.ASL[i]}.png`
                        this.images[i].onload = function() {
                            resolve(true);
                        }
                    })
                );
            }
            Promise.all(promises).then(result => {
                console.log("DragDrop Assets loaded!");
                htmlCode += this.buildHTML("bank");
                htmlCode += this.buildHTML("answers");
                return resolve(htmlCode+`</div></div>`);
            });
        });
    }

    setUp(): void {
        document.getElementsByClassName(`dd-ASL-bank`)[this.id-1].id = `dd-ASL-bank-${this.id}`;
        document.getElementsByClassName(`dd-ASL-answer-bank`)[this.id-1].id = `dd-ASL-answer-bank-${this.id}`;

        var ASL_bank = <HTMLElement>document.getElementsByClassName(`dd-ASL-bank`)[this.id-1];
        var ASL_answer_bank = <HTMLElement>document.getElementsByClassName(`dd-ASL-answer-bank`)[this.id-1];
        var that = this;
        
        //set innerHTMLs for both banks
        //ASL_bank.innerHTML = this.buildHTML("bank");
        //ASL_answer_bank.innerHTML = this.buildHTML("answers");

        this.answers = ASL_answer_bank.querySelectorAll(".dd-ASL-bank-answer");
        
        //set up event listeners
        ASL_bank.ondrop = function(e: DragEvent) { that.drop(e); }
        ASL_bank.ondrag = function(e: DragEvent) { return false; }
        ASL_bank.ondragover = function(e: DragEvent) { that.allowDrop(e); }
        let temp1 = <NodeListOf<HTMLElement>>ASL_bank.querySelectorAll('.dd-ASL-image');
        let temp2 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.dd-ASL-image');
        let temp3 = <NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll('.dd-ASL-bank-answer');
        for (let i = 0; i < temp1.length; i++) { temp1[i].ondragstart = function(e) { that.drag(e); } }
        for (let i = 0; i < temp2.length; i++) { temp2[i].ondragstart = function(e) { that.drag(e); } }
        for (let i = 0; i < temp3.length; i++) { temp3[i].ondrop = function(e) { that.drop(e); }; temp3[i].ondragover = function(e) { that.allowDrop(e); } }
    }
    
    private buildHTML(type: string): string {
        var html = "";
        if (type === "bank") {
            for (let i = 0; i < this.images.length; i++) {
                html += `<img class="dd-ASL-image" id="dd-${this.ASL[i]}" src="${this.images[i].src}" draggable="true">`;
            }
        } else if (type === "answers") {
            for (let i = 0; i < this.ASL.length; i++) {
                html += `<div class="dd-ASL-bank-answer" id="dd-box${this.ASL[i]}" draggable="false"></div>`;
            }
        }
        return html+`</div>`;
    }
        
    private allowDrop(ev: DragEvent) {
        ev.preventDefault();
    }
            
    private drag(ev: DragEvent) {
        ev.dataTransfer?.setData("phrase", (ev.target as Element).id+","+((ev.target as Element).parentNode as Element).id);
    }
        
    private drop(ev: DragEvent) {
        ev.preventDefault();
        var data: string[] = [];
        if (ev.dataTransfer) {
            data = ev.dataTransfer.getData("phrase").split(",");    //[0] = dragged element's ID, [1] = dragged element's parent ID
        }
        var drag_target = document.getElementById(data[0]);         //what element is being dragged
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById((ev.target as HTMLElement).id);   //where the dragged element is going
    
        if (/dd-box[A-Z]/.test((drop_target?.parentNode as HTMLElement).id)) {   //check if the drop target is an image inside an answer box
            this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
        } else if ((drop_target?.parentNode as HTMLElement).id === `dd-ASL-answer-bank-${this.id}`) {   //check if the drop target is an answer box inside the answer bank
            var flags = drop_target?.id.split("|");  //[0] = id, [1] = filled flag
            if (flags && flags[1] === "filled") {    //answer box is already filled
                this.swapElements((drag_target as HTMLElement), (drop_target?.childNodes[0] as HTMLElement), (drag_parent as HTMLElement));
            } else {    //answer box is empty
                if (drag_target !== null) {
                    (drop_target as Element).id = drop_target?.id+"|filled";
                    drop_target?.appendChild(drag_target);
                    if (/filled/.test((drag_parent as HTMLElement).id))  //reset parent id to not include 'filled'
                        (drag_parent as HTMLElement).id = (drag_parent as HTMLElement).id.substring(0, (drag_parent as HTMLElement).id.length-7);
                }
            }
        } else if ((drop_target?.parentNode as HTMLElement).id === `dd-ASL-bank-${this.id}`) {  //check if the drop target is an image inside the bank
            if (drag_parent?.id !== `dd-ASL-bank-${this.id}`)
                this.swapElements((drag_target as HTMLElement), (drop_target as HTMLElement), (drag_parent as HTMLElement));
        } else if (drop_target?.id === `dd-ASL-bank-${this.id}`) {     //check if the drop target is the bank
            if (drag_parent?.id !== `dd-ASL-bank-${this.id}`) {    //do nothing if the drag parent and drop target are both the bank
                drop_target.appendChild((drag_target as HTMLElement));
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
    
    //checks answers of all DragDrop instances
    private checkAnswers() {
        let count = 0;
        for (let i = 0; i < this.answers.length; i++) {
            let child = this.answers[i].childNodes[0];
            if(this.answers[i].id.charAt(6) === child?.id.charAt(3)) count++;
        }
        this.done = (count===this.answers.length);
        console.log(this.done);
    }
}