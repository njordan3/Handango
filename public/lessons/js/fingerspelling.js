export {
    setUp as setUp,
    done as done
}

var done = false;


function setUp(phrase) {
    var ASL = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var ASL_bank = document.getElementById("fs-ASL-bank");
    var ASL_answer_bank = document.getElementById("fs-ASL-answer-bank");
    var answers;

    //loading the assets
    var images = [];
    var promises = [];
    for (let i = 0; i < ASL.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                images[i] = new Image();
                images[i].src = `/lessons/assets/${ASL[i]}.png`
                images[i].onload = function() {
                    resolve(true);
                }
            })
        );
    }
    Promise.all(promises).then(result => {
        console.log("Finger Spelling ASL Assets loaded!");

        //build answer bank
        ASL_answer_bank.innerHTML = buildHTML("answers");
        ASL_answer_bank.ondrop = function(e) { drop(e); }
        ASL_answer_bank.ondragover = function(e) { allowDrop(e); }

        //build ASL bank with images
        resetASLBank();

        //get answer boxes
        answers = document.getElementsByClassName("fs-ASL-bank-answer");    
    });

    function buildHTML(type) {
        var html = "";
        //fill out ASL bank
        if (type === "bank") {
            for (let i = 0; i < images.length; i++) {
                if (document.getElementById(ASL[i]) === null) {
                html += `<img class="fs-ASL-image" id="${ASL[i]}" src="${images[i].src}" draggable="true">`;
                } else {
                    let count = 1;
                    while(document.getElementById(`${ASL[i]}${count}`) !== null) {
                        count++;
                    }
                    html += `<img class="fs-ASL-image" id="${ASL[i]}${count}" src="${images[i].src}" draggable="true">`;
                }
                
            }
        //fill out answer bank
        } else if (type === "answers") {
            let duplicates = {};
            for (let i = 0; i < phrase.length; i++) {
                for (let j = 0; j < phrase[i].length; j++) {
                    let id;
                    if (duplicates[phrase[i][j]] === undefined) {
                        id = phrase[i][j];
                        duplicates[phrase[i][j]] = {count: 1};
                    } else {
                        duplicates[phrase[i][j]].count++;
                        id = `${phrase[i][j]}${duplicates[phrase[i][j]].count}`;
                    }
                    html += `<div class="fs-ASL-bank-answer" id="box-${id}"></div>`;
                }
                html += `<div class="break"></div>`;
            }
        }
        return html;
    }

    function resetASLBank() {
        ASL_bank.innerHTML = "";
        ASL_bank.innerHTML = buildHTML("bank");
        ASL_bank.ondrop = function(e) { drop(e); }
        ASL_bank.ondragover = function(e) { allowDrop(e); }

        for(let i = 0; i < images.length; i++) {
        document.getElementsByClassName("fs-ASL-image")[i].ondragstart = function(e) { drag(e); }
        }
        //resize images to fit better on screen
        let temp = document.getElementsByClassName("fs-ASL-image");
        for (let i = 0; i < temp.length; i++) {
        temp[i].style.width = "auto";
        temp[i].style.height = "100px";
        }
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }
    
    function drag(ev) {
        ev.dataTransfer.setData("phrase", ev.target.id+","+ev.target.parentNode.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("phrase");
        data = data.split(","); //[0] = dragged element's ID, [1] = dragged element's parent ID
        
        var drag_target = document.getElementById(data[0]);         //what element is being dragged
        var drag_parent = document.getElementById(data[1]);         //where the dragged element came from
        var drop_target = document.getElementById(ev.target.id);    //where the dragged element is going

        if (/box-/.test(drop_target.parentNode.id)) {   //check if the drop target is an image inside an answer box
            swapElements(drag_target, drop_target, drag_parent);
            drag_target.parentNode.style.width = drag_target.style.width;
        } else if (drop_target.parentNode.id === "fs-ASL-answer-bank") {   //check if the drop target is an answer box inside the answer bank
            var flags = drop_target.id.split("|");  //[0] = id, [1] = filled flag
            if (flags[1] === "filled") {    //answer box is already filled
                swapElements(drag_target, drop_target.childNodes[0], drag_parent);
                drag_target.parentNode.style.width = drag_target.style.width;
            } else {    //answer box is empty
                if (drag_target !== null) {
                    drop_target.id = drop_target.id+"|filled";
                    drop_target.appendChild(drag_target);
                    if (/filled/.test(drag_parent.id)) {  //reset parent id to not include 'filled'
                        drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
                    }
                    drag_target.parentNode.style.width = drag_target.style.width;
                }
            }
        } else if (drop_target.parentNode.id === "fs-ASL-bank") {  //check if the drop target is an image inside the bank
            if (drag_parent.id !== "fs-ASL-bank")
                swapElements(drag_target, drop_target, drag_parent);
        } else if (drop_target.id === "fs-ASL-bank") {     //check if the drop target is the bank
            if (drag_parent.id !== "fs-ASL-bank") {    //do nothing if the drag parent and drop target are both the bank
                drop_target.appendChild(drag_target);
                if (/filled/.test(drag_parent.id))  //reset parent id to not include 'filled'
                    drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
            }
        }
        resetASLBank();
        checkAnswers();
    }

    function swapElements(drag, drop, parent) {
        var temp = drop.parentNode.id;
        parent.appendChild(drop);
        document.getElementById(temp).appendChild(drag);
    }

    function checkAnswers() {
        let letters_correct = 0;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].id.charAt(4).toUpperCase() === answers[i].childNodes[0]?.id.charAt(0)) {
                letters_correct++;
            }
        }
        done = (letters_correct === answers.length);
    }
}