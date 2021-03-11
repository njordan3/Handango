export class MultipleChoice {
    static count = 1;
    template = `
    <div class="mySlides">
        <div class="mc-slide">
            <div class="quiz"></div>
        </div>
    </div>`;
    private answers: any;
    private questions: any[];
    private ans: string[]|null;
    private ans_id: number|null;
    private socket: any;
    private id: number;
    done: boolean;
    answers_correct: number = 0;
    answers_count: number = 0;
    setAnswer: Function|null;
    constructor(questions: any[], ans: string[]|null = null, ans_id: number|null = null, setAnswer: Function|null = null) {
        this.questions = questions;
        this.ans = ans;
        this.ans_id = ans_id;
        this.setAnswer = setAnswer;
        this.id = MultipleChoice.count++;
        this.done = false;
    }

    setUp() {
        this.answers = new Array(this.questions.length);
        this.answers_count = this.answers.length;

        let that = this;
        
        document.getElementsByClassName('quiz')[this.id-1].id = `quiz-${this.id}`;
        var quiz = <HTMLElement>document.getElementById(`quiz-${this.id}`);
        quiz.innerHTML = this.buildHTML();
        
        this.plugAnswers(quiz.querySelectorAll('.choices'));

        var choices = quiz.querySelectorAll('.choices');
        for (let i = 0; i < choices.length; i++) {
            choices[i].addEventListener('change', function(e: Event) { that.checkAnswers(e); });
        }
    }

    private buildHTML() {
        let html: string = "";
        for (let i = 0; i < this.questions.length; i++) {
            html += `<p>${this.questions[i].question}</p>`;
            for (let j = 0; j < this.questions[i].choices.length; j++) {
                html += `<input type="radio" class="choices" id="${i}|${j}|${this.id}" name="q${i}-${this.id}">
                         <label for="${i}|${j}|${this.id}">${this.questions[i].choices[j]}</label>
                         <div class="break"></div>`;
            }
        }
        return html;
    }

    private plugAnswers(answerBank: NodeListOf<HTMLElement> ) {
        if (this.ans !== null) {
            for (let i = 0; i < answerBank.length; i++) {
                for (let j = 0; j < this.ans.length; j++) {
                    if (answerBank[i].id === `${j}|${this.ans[j]}|${this.id}`)
                        (answerBank[i] as HTMLInputElement).checked = true;
                        this.answers[j] = this.ans[j];
                }
            }
            
        }
    }

    private checkAnswers(e: Event) {
        let t = (e.target as Element).id.split("|");
        this.answers[t[0]] = parseInt(t[1]);
        console.log(this.answers)
        this.answers_correct = 0;
        let sendAnswers: string[] = [];
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i] === this.questions[i].correct) this.answers_correct++;

            let temp = this.answers[i]
            if (temp === undefined) temp = "";
            sendAnswers.push(temp);
        }
        
        this.done = (this.answers_correct === this.answers_count);
        console.log(this.done);
        if (this.setAnswer) this.setAnswer({type: "MultipleChoice", id: this.ans_id, answers: sendAnswers});
    }
}