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

//////////////////////////////[LESSON SETUP]//////////////////////////////

if (part === 'quiz' && lesson_num == 3) {
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

    ////////////////////////////[TIMER SETUP]////////////////////////////
    function getMinutes(distance) { return Math.floor((distance % 3600000) / (60000)); }
    function getSeconds(distance) { return Math.floor((distance % 60000) / 1000); }
    var countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 10);  //add 10 minutes
    var now = new Date().getTime();
    var distance = countDownDate - now;
    //set up initial timer display
    document.getElementById("timer").innerHTML = `${getMinutes(distance)}m ${getSeconds(distance)}s`;

    //update time every 1 second
    var timer = setInterval(function() {
        // Find the distance between now and the count down date
        now = new Date().getTime();
        distance = countDownDate - now;

        document.getElementById("timer").innerHTML = `${getMinutes(distance)}m ${getSeconds(distance)}s`;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("timer").innerHTML = "TIME'S UP";
        }
    }, 1000);

    ////////////////////////////[SLIDE LOGIC]////////////////////////////
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

    //stops any webcam that is running in a slide
    function callStop() {
        for (let i = 0; i < lessons.length; i++) {
            if (lessons[i].stop !== undefined) lessons[i].stop();
        }
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
        window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
    }
    next_part.onclick = function() {
        callStop();
        //make sure that the user is ready to submit
        sendComplete();
    }
    
} else {
    console.log(`This is lesson3-quiz.js in lesson ${lesson_num} ${part}`);
}