export class DragDrop {
    static count = 1;
    template = `
    <div class="mySlides fade">
        <div class="slide">
            <div class="dd-ASL-bank"></div>
            <div class="dd-ASL-answer-bank"></div>
        </div>
    </div>`;
    images = [];
    answers;
    constructor(ASL) {
        this.ASL = ASL;
        this.id = DragDrop.count++;
        this.done = false;
    }

    setUp() {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName(`dd-ASL-bank`)[this.id-1].id = `dd-ASL-bank-${this.id}`;
            document.getElementsByClassName(`dd-ASL-answer-bank`)[this.id-1].id = `dd-ASL-answer-bank-${this.id}`;

            var ASL_bank = document.getElementsByClassName(`dd-ASL-bank`)[this.id-1];
            var ASL_answer_bank = document.getElementsByClassName(`dd-ASL-answer-bank`)[this.id-1];
            var that = this;
            //loading the assets
            var promises = [];
            for (let i = 0; i < this.ASL.length; i++) {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.images.push(new Image());
                        this.images[i].src = `/lessons/assets/${this.ASL[i]}.png`
                        this.images[i].onload = function() {
                            resolve(true);
                        }
                    })
                );
            }
            Promise.all(promises).then(result => {
                console.log("DragDrop Assets loaded!");
                //set innerHTMLs for both banks
                ASL_bank.innerHTML = this.#buildHTML("bank");
                ASL_answer_bank.innerHTML = this.#buildHTML("answers");
    
                this.answers = ASL_answer_bank.querySelectorAll(".dd-ASL-bank-answer");
                
                //set up event listeners
                ASL_bank.ondrop = function(e) { that.#drop(e); }
                ASL_bank.ondrag = function(e) { return false; }
                ASL_bank.ondragover = function(e) { that.#allowDrop(e); }
                let temp1 = ASL_bank.querySelectorAll('.dd-ASL-image');
                let temp2 = ASL_answer_bank.querySelectorAll('.dd-ASL-image');
                let temp3 = ASL_answer_bank.querySelectorAll('.dd-ASL-bank-answer');
                for (let i = 0; i < temp1.length; i++) { temp1[i].ondragstart = function(e) { that.#drag(e); } }
                for (let i = 0; i < temp2.length; i++) { temp2[i].ondragstart = function(e) { that.#drag(e); } }
                for (let i = 0; i < temp3.length; i++) { temp3[i].ondrop = function(e) { that.#drop(e); }; temp3[i].ondragover = function(e) { that.#allowDrop(e); } }
                return resolve();
            });
        })
    }
    
    #buildHTML(type) {
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
        return html;
    }
        
    #allowDrop(ev) {
        ev.preventDefault();
    }
            
    #drag(ev) {
        ev.dataTransfer.setData("phrase", ev.target.id+","+ev.target.parentNode.id);
    }
        
    #drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("phrase");
        data = data.split(","); //[0] = dragged element's ID, [1] = dragged element's parent ID
        
        var drag_target = document.getElementById(data[0]);         //what element is being dragged
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById(ev.target.id);    //where the dragged element is going
    
        if (/dd-box[A-Z]/.test(drop_target.parentNode.id)) {   //check if the drop target is an image inside an answer box
            this.#swapElements(drag_target, drop_target, drag_parent);
        } else if (drop_target.parentNode.id === `dd-ASL-answer-bank-${this.id}`) {   //check if the drop target is an answer box inside the answer bank
            var flags = drop_target.id.split("|");  //[0] = id, [1] = filled flag
            if (flags[1] === "filled") {    //answer box is already filled
                this.#swapElements(drag_target, drop_target.childNodes[0], drag_parent);
            } else {    //answer box is empty
                if (drag_target !== null) {
                    drop_target.id = drop_target.id+"|filled";
                    drop_target.appendChild(drag_target);
                    if (/filled/.test(drag_parent.id))  //reset parent id to not include 'filled'
                        drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
                }
            }
        } else if (drop_target.parentNode.id === `dd-ASL-bank-${this.id}`) {  //check if the drop target is an image inside the bank
            if (drag_parent.id !== `dd-ASL-bank-${this.id}`)
                this.#swapElements(drag_target, drop_target, drag_parent);
        } else if (drop_target.id === `dd-ASL-bank-${this.id}`) {     //check if the drop target is the bank
            if (drag_parent.id !== `dd-ASL-bank-${this.id}`) {    //do nothing if the drag parent and drop target are both the bank
                drop_target.appendChild(drag_target);
                if (/filled/.test(drag_parent.id))  //reset parent id to not include 'filled'
                    drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
            }
        }
    
        this.#checkAnswers();
    }
        
    #swapElements(drag, drop, parent) {
        var temp = drop.parentNode.id;
        parent.appendChild(drop);
        document.getElementById(temp).appendChild(drag);
    }
    
    //checks answers of all DragDrop instances
    #checkAnswers() {
        let count = 0;
        for (let i = 0; i < this.answers.length; i++) {
            let child = this.answers[i].childNodes[0];
            if(this.answers[i].id.charAt(6) === child?.id.charAt(3)) count++;
        }
        this.done = (count===this.answers.length);
        console.log(this.done);
    }
}