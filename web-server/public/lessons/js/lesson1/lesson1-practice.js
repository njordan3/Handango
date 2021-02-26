import {DragDrop} from '../utilities/drag-drop.js';
import {FingerSpelling} from '../utilities/fingerspelling.js';
import {FingerSpellingInterp} from '../utilities/fingerspelling-interp.js';
import {MultipleChoice} from '../utilities/mutliple-choice.js';
import {Webcam} from '../utilities/web-cam.js';

let lesson_num = window.location.pathname.split('/')[1].charAt(6);
let part = window.location.pathname.split('/')[2];

//////////////////////////////[SOCKET.IO]//////////////////////////////
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

export {
    socket as socket
}

//////////////////////////////[Lesson Setup]//////////////////////////////
if (part === 'practice' && lesson_num == 1) {
    var lessons = [];
    lessons.push(new Webcam("G", socket));
    lessons.push(new DragDrop(["J", "B", "Z"]));
    lessons.push(new FingerSpelling(["food", "drink", "napkin"]));
    lessons.push(new FingerSpellingInterp(["food", "drink", "napkin"]));
    lessons.push(new MultipleChoice([
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
    ]));

    //load up slideshow container with custom slide templates from each lesson slide
    for (let i = 0; i < lessons.length; i++) {
        document.getElementsByClassName("slideshow-container")[0].innerHTML += lessons[i].template;
    }

    //setup each lesson one after the other is finished
    let promiseChain = Promise.resolve();
    for (let i = 0; i < lessons.length; i++) {
        const makePromise = function(i) {
            return lessons[i].setUp();
        }
        promiseChain = promiseChain.then(makePromise(i));
    }

    //////////////////////////////[SLIDE LOGIC]//////////////////////////////
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
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex-1].style.display = "block";
    }

    //stops any webcam that is running in a slide
    function callStop() {
        for (let i = 0; i < lessons.length; i++) {
            if (lessons[i].stop !== undefined) lessons[i].stop();
        }
    }

    function allDone() {
        let count = 0;
        for (let i = 0; i < lessons.length; i++) {
            if (lessons[i].done) count++;
        }
        return (count === lessons.length);
    }

    //setup prev and next slide buttons
    const prev_slide = document.getElementById("prev-slide");
    const next_slide = document.getElementById("next-slide");
    prev_slide.onclick = function() { callStop(); plusSlides(-1); }
    next_slide.onclick = function() { callStop(); plusSlides(1); }

    //set up prev and next part buttons
    const prev_part = document.getElementById("prev-part");
    const next_part = document.getElementById("next-part");
    prev_part.onclick = function() {
        callStop();
        window.location.href = `https://duohando.com/lesson${lesson_num}/lecture`;
    }
    next_part.onclick = function() {
        callStop();
        if (allDone()) {
            sendComplete();
        } else {
            console.log("Next: Not finished with Practice");
        }
    }

} else {
    console.log(`This is lesson1-practice.js in lesson ${lesson_num} ${part}`);
}