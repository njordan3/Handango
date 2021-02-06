import * as DragDrop from './drag-drop.js';
import * as FingerSpelling from './fingerspelling.js';
import * as FingerSpellingInterp from './fingerspelling-interp.js';
import * as MultipleChoice from './mutliple-choice.js';

let lesson_num = window.location.pathname.split('/')[1].charAt(6);
let part = window.location.pathname.split('/')[2];

var socket = io();
socket.on('complete-confirmation', function(redirect) {
    window.location.href = redirect;
});

function sendProgress() {
    if (part !== 'quiz') {
        let msg = {
            lesson: lesson_num,
            slide: slideIndex
        }
        socket.emit(`${part}-progress`, msg);
    } else {
        console.log("Quiz progress isn't saved");
    }
}
function sendComplete() {
    if (part !== 'lecture') {
        socket.emit(`${part}-complete`, {lesson: lesson_num});
    } else {
        console.log("Lecture completion isn't saved");
    }
}

const slides = document.getElementsByClassName("mySlides");

var slideIndex = parseInt(document.getElementById('current-slide').innerHTML !== undefined ? document.getElementById('current-slide').innerHTML : 1);
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
    sendProgress();
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
  console.log(n);
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

//setup prev and next slide buttons
const prev_slide = document.getElementById("prev-slide");
const next_slide = document.getElementById("next-slide");
prev_slide.onclick = function() { plusSlides(-1); }
next_slide.onclick = function() { plusSlides(1); }

//set up prev and next part buttons
const prev_part = document.getElementById("prev-part");
const next_part = document.getElementById("next-part");
prev_part.onclick = function() {
    if (part === 'lecture') {
        window.location.href = "https://duohando.com/dashboard";
    } else if (part === 'practice') {
        window.location.href = `https://duohando.com/lesson${lesson_num}/lecture`;
    } else if (part === 'quiz') {
        window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
    }
}
next_part.onclick = function() {
    if (part === 'lecture') {
        window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
    } else if (part === 'practice') {
        if (DragDrop.done && FingerSpelling.done && FingerSpellingInterp.done && MultipleChoice.done) {
            sendComplete();
        } else {
            console.log("Next: Not finished with Practice");
        }
    } else if (part === 'quiz') {
        //make sure that the user is ready to submit
        sendComplete();
    }
}

if (part === 'practice' || part === 'quiz') {
    DragDrop.setUp(["J", "B", "Z"]);
    FingerSpelling.setUp(["food", "drink", "napkin"]);
    FingerSpellingInterp.setUp(["food", "drink", "napkin"]);
    var questions = [
      {
          question: "Question 1?",
          choices:    [
              "Choice 1",
              "Choice 2",
              "Choice 3",
              "Choice 4",
          ],
          correct: 1
      },
      {
          question: "Question 2?",
          choices:    [
              "Choice 1",
              "Choice 2",
              "Choice 3",
              "Choice 4",
          ],
          correct: 3
      },
      {
          question: "Question 3?",
          choices:    [
              "Choice 1",
              "Choice 2",
              "Choice 3",
              "Choice 4",
          ],
          correct: 0
      }
    ];
    MultipleChoice.setUp(questions);
}
