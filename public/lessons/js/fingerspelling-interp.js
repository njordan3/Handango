export {
    setUp as setUp,
    done as done
}

var done = false;

function setUp(phrase) {
    var ASL_bank = document.getElementById("fsi-ASL-bank");
    var ASL_answer_bank = document.getElementById("fsi-ASL-answer-bank");
    var answers;
    
    //loading the assets
    var images = [];
    var promises = [];
    let k = 0;
    for (let i = 0; i < phrase.length; i++) {
        for (let j = 0; j < phrase[i].length; j++) {
            promises.push(
                new Promise((resolve, reject) => {
                    images[k] = new Image();
                    images[k].src = `/lessons/assets/${phrase[i][j]}.png`
                    images[k].onload = function() {
                        resolve(true);
                    }
                    k++
                })
            );
        }
    }
    Promise.all(promises).then(result => {
        console.log("Finger Spelling Interpretation ASL Assets loaded!");
    
        //build answer bank
        ASL_answer_bank.innerHTML = buildHTML("answers");
    
        //build ASL bank with images
        ASL_bank.innerHTML = buildHTML("bank");
    
        //resize images to fit better on screen
        let temp = document.getElementsByClassName("fsi-ASL-image");
        for (let i = 0; i < temp.length; i++) {
            temp[i].style.width = "auto";
            temp[i].style.height = "100px";
        }
    
        //get answer boxes
        answers = document.getElementsByClassName("fsi-ASL-bank-answer");
        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('input', checkAnswers);
        }
    });
    
    function buildHTML(type) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            let k = 0;
            for (let i = 0; i < phrase.length; i++) {
                for (let j = 0; j < phrase[i].length; j++) {
                    html += `<img class="fsi-ASL-image" src="${images[k++].src}" draggable="false">`;
                }
                html += `<div class="break"></div>`
            }
        //fill out answer bank
        } else if (type === "answers") {
            for (let i = 0; i < phrase.length; i++) {
                html += `<label for="text${i}">Word ${i+1}:</label><input type="text" autocomplete="off" class="fsi-ASL-bank-answer" id="text${i}"></input><div class="break"></div>`;
            }
        }
        return html;
    }
    
    function checkAnswers(e) {
        let count = 0;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].value === phrase[answers[i].id.charAt(4)]) count++;
        }
        done = (count === answers.length);
    }
}