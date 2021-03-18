export class FingerSpellingInterpQuestions {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="fsiq-ASL-bank"></div>
            <div class="fsiq-ASL-answer-bank"></div>
        </div>
    </div>`;
    private files: string[] = [];
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
        this.id = FingerSpellingInterpQuestions.count++;
        this.done = false;
    }

    setUp() {
        //loading the assets
        var promises = [];
        for (let i = 0; i < this.phrase.length; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    this.files.push(`../../../assets/Images/${this.phrase[i]}.mp4`);
                    resolve(true);
                })
            );
            
        }
        Promise.all(promises).then(result => {
            console.log("Finger Spelling Interpretation Questions ASL Assets loaded!");

            document.getElementsByClassName(`fsiq-ASL-bank`)[this.id-1].id = `fsiq-ASL-bank-${this.id}`;
            document.getElementsByClassName(`fsiq-ASL-answer-bank`)[this.id-1].id = `fsiq-ASL-answer-bank-${this.id}`;

            var ASL_bank = <HTMLElement>document.getElementById(`fsiq-ASL-bank-${this.id}`);
            var ASL_answer_bank = <HTMLElement>document.getElementById(`fsiq-ASL-answer-bank-${this.id}`);
            let that = this;

            //build answer bank
            ASL_answer_bank.innerHTML = this.buildHTML("answers");

            //build ASL bank with images
            ASL_bank.innerHTML = this.buildHTML("bank");

            this.plugAnswers(<NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll(".fsiq-ASL-bank-answer"));

            //get answer boxes
            this.answers = ASL_answer_bank.querySelectorAll(".fsiq-ASL-bank-answer");
            this.answers_count = this.answers.length;

            for (let i = 0; i < this.answers.length; i++) {
                this.answers[i].addEventListener('input', function() { that.checkAnswers(); });
            }
            this.checkAnswers();
        });
    }

    private buildHTML(type: string) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            let k = 0;
            for (let i = 0; i < this.files.length; i++) {
                html += 
                `<video class="fsiq-ASL-image" id="fsiq-${this.phrase[i]}" width="360" height="240" draggable="true" controls >
                    <source src="${this.files[i]}">>
                    Your browser doesn't support the displaying videos...
                </video>`;
            }
        //fill out answer bank
        } else if (type === "answers") {
            for (let i = 0; i < this.phrase.length; i++) {
                html += `<label for="fsiq-text${i}-${this.phrase[i]}-${this.id}">Phrase ${i+1}:</label><input type="text" autocomplete="off" class="fsiq-ASL-bank-answer" id="fsiq-text${i}-${this.phrase[i]}-${this.id}"></input><div class="break"></div>`;
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
            if (this.answers[i].value.toLowerCase().replaceAll(" ", "") === this.phrase[i]) this.answers_correct++;
            
            let temp = this.answers[i].value
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "FingerSpellingInterpQuestions", id: this.ans_id, answers: sendAnswers});
    }
}