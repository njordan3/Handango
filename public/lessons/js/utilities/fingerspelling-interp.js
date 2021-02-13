export class FingerSpellingInterp {
    static count = 1;
    template = `
    <div class="mySlides fade">
        <div class="slide">
            <div class="fsi-ASL-bank"></div>
            <div class="fsi-ASL-answer-bank"></div>
        </div>
    </div>`;
    images = [];
    answers;
    constructor(phrase) {
        this.phrase = phrase;
        this.id = FingerSpellingInterp.count++;
        this.done = false;
    }

    setUp() {
        //loading the assets
        var promises = [];
        let k = 0;
        for (let i = 0; i < this.phrase.length; i++) {
            for (let j = 0; j < this.phrase[i].length; j++) {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.images.push(new Image());
                        this.images[k].src = `/lessons/assets/${this.phrase[i][j]}.png`
                        this.images[k].onload = function() {
                            resolve(true);
                        }
                        k++
                    })
                );
            }
        }
        Promise.all(promises).then(result => {
            console.log("Finger Spelling Interpretation ASL Assets loaded!");

            document.getElementsByClassName(`fsi-ASL-bank`)[this.id-1].id = `fsi-ASL-bank-${this.id}`;
            document.getElementsByClassName(`fsi-ASL-answer-bank`)[this.id-1].id = `fsi-ASL-answer-bank-${this.id}`;

            var ASL_bank = document.getElementById(`fsi-ASL-bank-${this.id}`);
            var ASL_answer_bank = document.getElementById(`fsi-ASL-answer-bank-${this.id}`);
            let that = this;

            //build answer bank
            ASL_answer_bank.innerHTML = this.#buildHTML("answers");

            //build ASL bank with images
            ASL_bank.innerHTML = this.#buildHTML("bank");

            //get answer boxes
            this.answers = ASL_answer_bank.querySelectorAll(".fsi-ASL-bank-answer")
            for (let i = 0; i < this.answers.length; i++) {
                this.answers[i].addEventListener('input', function() { that.#checkAnswers(); });
            }
        });
    }

    #buildHTML(type) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            let k = 0;
            for (let i = 0; i < this.phrase.length; i++) {
                for (let j = 0; j < this.phrase[i].length; j++) {
                    html += `<img class="fsi-ASL-image" src="${this.images[k++].src}" draggable="false">`;
                }
                html += `<div class="break"></div>`
            }
        //fill out answer bank
        } else if (type === "answers") {
            for (let i = 0; i < this.phrase.length; i++) {
                html += `<label for="fsi-text${i}">Word ${i+1}:</label><input type="text" autocomplete="off" class="fsi-ASL-bank-answer" id="fsi-text${i}"></input><div class="break"></div>`;
            }
        }
        return html;
    }

    #checkAnswers(e) {
        let count = 0;
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i].value === this.phrase[this.answers[i].id.charAt(8)]) count++;
        }
        this.done = (count === this.answers.length);
        console.log(this.done);
    }
}