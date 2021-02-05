export {
    setUp as setUp,
    done as done
}

var done = false;

function setUp(questions) {
    var answers = new Array(questions.length);
    
    var quiz = document.getElementById("quiz");
    quiz.innerHTML = buildHTML();
    
    var choices = document.getElementsByClassName("choices");
    for (let i = 0; i < choices.length; i++) {
        choices[i].addEventListener('change', checkAnswers);
    }
    
    function buildHTML() {
        let html = "";
        for (let i = 0; i < questions.length; i++) {
            html += `<p>${questions[i].question}</p>`;
            for (let j = 0; j < questions[i].choices.length; j++) {
                html += `<input type="radio" class="choices" id="${i}|${j}" name="q${i}"><label for="q${i}-c${j}">${questions[i].choices[j]}</label><div class="break"></div>`;
            }
        }
        return html;
    }
    
    function checkAnswers(e) {
        let t = e.target.id.split("|");
        answers[t[0]] = parseInt(t[1]);
        let count = 0;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] === questions[i].correct) count++;
        }
        done = (count === answers.length);
    }
}