export class SelectQuestions {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="slide">
            <div class="sq-ASL-bank"></div>
            <div class="sq-ASL-answer-bank"></div>
        </div>
    </div>`;
    private answers: any;
    private answer: string;
    private selected: string|null = null;
    private choices: string[];
    private ans: string[]|null;
    private ans_id: number|null;
    private socket: any;
    private id: number;
    done: boolean;
    answers_correct: number = 0;
    answers_count: number = 0;
    setAnswer: Function|null;
    constructor(question: any, ans: string[]|null = null, ans_id: number|null = null, setAnswer: Function|null = null) {
        this.answer = question.answer;
        this.choices = question.choices;
        this.ans = ans;
        this.ans_id = ans_id;
        this.setAnswer = setAnswer;
        this.id = SelectQuestions.count++;
        this.done = false;
    }

    setUp() {
        console.log("Select Questions ASL Assets loaded!");

        document.getElementsByClassName(`sq-ASL-bank`)[this.id-1].id = `sq-ASL-bank-${this.id}`;
        document.getElementsByClassName(`sq-ASL-answer-bank`)[this.id-1].id = `sq-ASL-answer-bank-${this.id}`;

        var ASL_bank = <HTMLElement>document.getElementById(`sq-ASL-bank-${this.id}`);
        var ASL_answer_bank = <HTMLElement>document.getElementById(`sq-ASL-answer-bank-${this.id}`);
        let that = this;

        //build answer bank
        ASL_answer_bank.innerHTML = this.buildHTML("answers");

        //build ASL bank with images
        ASL_bank.innerHTML = this.buildHTML("bank");

        this.plugAnswers(<NodeListOf<HTMLElement>>ASL_answer_bank.querySelectorAll(".sq-ASL-bank-answer"));

        //get answer boxes
        this.answers = ASL_answer_bank.querySelectorAll(".sq-ASL-bank-answer");
        this.answers_count = this.answers.length;

        for (let i = 0; i < this.answers.length; i++) {
            (this.answers[i] as HTMLElement).onclick = function(e: MouseEvent) { 
                e.preventDefault();
                let lastSelected = document.getElementById(`sq-${that.selected}`)
                let target = (e.target as HTMLElement)

                if (lastSelected)
                    (lastSelected?.parentNode as HTMLElement).style.backgroundColor = "transparent";
                
                that.selected = target.id.split('-')[1];
                (target.parentNode as HTMLElement).style.backgroundColor = "cadetblue";
                that.checkAnswers();
            };
        }
    }

    private buildHTML(type: string) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            html += `<p class="sq-instruction" id="sq-${this.id}">Select the video that shows <b>${this.answer.charAt(0).toUpperCase()}${this.answer.substring(1).toLowerCase()}</b>:</p>`;
        //fill out answer bank1
        } else if (type === "answers") {
            for (let i = 0; i < this.choices.length; i++) {
                html += 
                `<div class="sq-selected">
                    <video class="sq-ASL-bank-answer" id="sq-${this.choices[i]}" width="360" height="240" draggable="true" controls >
                        <source src="../../../assets/Images/${this.choices[i]}.mp4">>
                        Your browser doesn't support the displaying videos...
                    </video>
                </div>`;
            }
        }
        return html;
    }

    private plugAnswers(answerBank: NodeListOf<HTMLElement>): void {
        if (this.ans !== null) {
            this.selected = this.ans[0];
            let target = document.getElementById(`sq-${this.ans[0]}`)
            if (target)
                (target?.parentNode as HTMLElement).style.backgroundColor = "cadetblue";
        }
    }

    private checkAnswers() {
        this.answers_correct = 0;
        let sendAnswers: string[] = [];
        this.done = (this.selected === (this.answer as any).toLowerCase().replaceAll(" ", ""))
        
        let temp = this.selected;
        if (!temp) temp = "";
        sendAnswers.push(temp);
        
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "SelectQuestions", id: this.ans_id, answers: sendAnswers});
    }
}