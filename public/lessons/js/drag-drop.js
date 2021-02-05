export {
    setUp as setUp,
    done as done
}

var done = false;

function setUp(ASL) {
    var ASL_bank = document.getElementById("dd-ASL-bank");
    var ASL_answer_bank = document.getElementById("dd-ASL-answer-bank");
    var answers;
    
    //loading the assets
    var images = [];
    var promises = [];
    var box_width = 0;
    var box_height = 0;
    for (let i = 0; i < ASL.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                images[i] = new Image();
                images[i].src = `/lessons/assets/${ASL[i]}.png`
                images[i].onload = function() {
                    box_width += images[i].width;
                    if (images[i].height > box_height) box_height = images[i].height;
                    resolve(true);
                }
            })
        );
    }
    Promise.all(promises).then(result => {
        console.log("DragDrop Assets loaded!");
    
        //set innerHTMLs for both banks
        ASL_bank.innerHTML = buildHTML("bank");
        ASL_answer_bank.innerHTML = buildHTML("answers");
    
        //make the bank size stay the same as images move
        var padding = {x: parseFloat(window.getComputedStyle(document.getElementsByClassName('dd-ASL-image')[0]).getPropertyValue(`padding-right`)),
                       y: parseFloat(window.getComputedStyle(document.getElementsByClassName('dd-ASL-image')[0]).getPropertyValue(`padding-top`))};
        ASL_bank.style.minWidth = box_width + padding.x * 2 * ASL.length;
        ASL_bank.style.minHeight = box_height + padding.y * 2 + 2;  //the plus 2 is a mystery
    
        answers = document.getElementsByClassName("dd-ASL-bank-answer");
        
        //set up event listeners
        ASL_bank.ondrop = function(e) { drop(e); }
        ASL_bank.ondrag = function(e) { return false; }
        ASL_bank.ondragover = function(e) { allowDrop(e); }
        for(let i = 0; i < images.length; i++) {
            document.getElementsByClassName("dd-ASL-image")[i].ondragstart = function(e) { drag(e); }
            document.getElementsByClassName("dd-ASL-bank-answer")[i].ondrop = function(e) { drop(e); }
            document.getElementsByClassName("dd-ASL-bank-answer")[i].ondragover = function(e) { allowDrop(e); }
        }
    });

    function buildHTML(type) {
        var html = "";
        if (type === "bank") {
            for (let i = 0; i < images.length; i++) {
                html += `<img class="dd-ASL-image" id="${ASL[i]}" src="${images[i].src}" draggable="true">`;
            }
        } else if (type === "answers") {
            for (let i = 0; i < ASL.length; i++) {
                html += `<div class="dd-ASL-bank-answer" id="box${ASL[i]}" draggable="false"></div>`;
            }
        }
        return html;
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
    
        if (/box[A-Z]/.test(drop_target.parentNode.id)) {   //check if the drop target is an image inside an answer box
            swapElements(drag_target, drop_target, drag_parent);
        } else if (drop_target.parentNode.id === "dd-ASL-answer-bank") {   //check if the drop target is an answer box inside the answer bank
            var flags = drop_target.id.split("|");  //[0] = id, [1] = filled flag
            if (flags[1] === "filled") {    //answer box is already filled
                swapElements(drag_target, drop_target.childNodes[0], drag_parent);
            } else {    //answer box is empty
                if (drag_target !== null) {
                    drop_target.id = drop_target.id+"|filled";
                    drop_target.appendChild(drag_target);
                    if (/filled/.test(drag_parent.id))  //reset parent id to not include 'filled'
                        drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
                }
            }
        } else if (drop_target.parentNode.id === "dd-ASL-bank") {  //check if the drop target is an image inside the bank
            if (drag_parent.id !== "dd-ASL-bank")
                swapElements(drag_target, drop_target, drag_parent);
        } else if (drop_target.id === "dd-ASL-bank") {     //check if the drop target is the bank
            if (drag_parent.id !== "dd-ASL-bank") {    //do nothing if the drag parent and drop target are both the bank
                drop_target.appendChild(drag_target);
                if (/filled/.test(drag_parent.id))  //reset parent id to not include 'filled'
                    drag_parent.id = drag_parent.id.substring(0, drag_parent.id.length-7);
            }
        }
    
        checkAnswers();
    }
    
    function swapElements(drag, drop, parent) {
        var temp = drop.parentNode.id;
        parent.appendChild(drop);
        document.getElementById(temp).appendChild(drag);
    }
    
    function checkAnswers() {
        let count = 0;
        for (let i = 0; i < answers.length; i++) {
            let child = answers[i].childNodes[0];
            if(answers[i].id.charAt(3) === child?.id) count++;
        }
        done = (count===answers.length);
    }
}