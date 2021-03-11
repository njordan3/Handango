export class FingerSpellingInterp {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="fsi-ASL-bank"></div>
            <div class="fsi-ASL-answer-bank"></div>
        </div>
    </div>`;
    private images: HTMLImageElement[] = [];
    private answers: any;
    private phrase: string[];
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
                        this.images[k].src = `../../../assets/Images/${this.phrase[i][j].toUpperCase()}.png`
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

            var ASL_bank = <HTMLElement>document.getElementById(`fsi-ASL-bank-${this.id}`);
            var ASL_answer_bank = <HTMLElement>document.getElementById(`fsi-ASL-answer-bank-${this.id}`);
            let that = this;

            //build answer bank
            ASL_answer_bank.innerHTML = this.buildHTML("answers");

            //build ASL bank with images
            ASL_bank.innerHTML = this.buildHTML("bank");

            this.plugAnswers(<NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll(".fsi-ASL-bank-answer"));

            //get answer boxes
            this.answers = ASL_answer_bank.querySelectorAll(".fsi-ASL-bank-answer");
            this.answers_count = this.answers.length;

            for (let i = 0; i < this.answers.length; i++) {
                this.answers[i].addEventListener('input', function() { that.checkAnswers(); });
            }
        });
    }

    private buildHTML(type: string) {
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
                html += `<label for="fsi-text${i}">Word ${i+1}:</label><input type="text" autocomplete="off" class="fsi-ASL-bank-answer" id="fsi-text${i}-${this.phrase[i]}"></input><div class="break"></div>`;
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
            if (this.answers[i].value === this.phrase[this.answers[i].id.charAt(8)]) this.answers_correct++;
            
            let temp = this.answers[i].value
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "FingerspellingInterp", id: this.ans_id, answers: sendAnswers});
    }
}