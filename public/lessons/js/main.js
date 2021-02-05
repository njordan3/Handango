import * as DragDrop from './drag-drop.js';
import * as FingerSpelling from './fingerspelling.js';
import * as FingerSpellingInterp from './fingerspelling-interp.js';
import * as MultipleChoice from './mutliple-choice.js';

const slides = document.getElementsByClassName("mySlides");

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
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
  //go to previous part which would be lecture
  console.log("Prev: Go to Lecture");
}
next_part.onclick = function() {
  //go to next part which would be quiz
  if (DragDrop.done && FingerSpelling.done && FingerSpellingInterp.done && MultipleChoice.done) console.log("Next: Go to Quiz");
  else console.log("Next: Not finished with Practice");
}

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