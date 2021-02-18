import {DragDrop} from '../../../assets/ts/drag-drop';
import {FingerSpelling} from '../../../assets/ts/fingerspelling';
import {FingerSpellingInterp} from '../../../assets/ts/fingerspelling-interp';
import {MultipleChoice} from '../../../assets/ts/multiple-choice';
import {Webcam} from '../../../assets/ts/web-cam';
import {io} from 'socket.io-client';

let lesson_num: number = parseInt(window.location.pathname.split('/')[1].charAt(6));
let part = window.location.pathname.split('/')[2];

var slideIndex: any = (document.getElementById('current-slide')?.innerHTML !== undefined ? document.getElementById('current-slide')?.innerHTML : 1);

//////////////////////////////[SOCKET.IO]//////////////////////////////
var socket = io();
socket.on('complete-confirmation', function(redirect: any) {
    window.location.href = redirect;
});

function sendProgress() {
    let msg = {
        lesson: lesson_num,
        slide: slideIndex
    }
    socket.emit(`${part}-progress`, msg);
}
function sendComplete() {
    socket.emit(`${part}-complete`, {lesson: lesson_num});
}
//////////////////////////////[Lesson Setup]//////////////////////////////
var lessons: any[] = [];
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

export function launch(): void {
    //setup each lessons' HTML template in the slideshow container
    for (let i = 0; i < lessons.length; i++) {
        document.getElementsByClassName('slideshow-container')[0].innerHTML += lessons[i].template;
    }
    //setup each lesson one after the other is finished
    let promiseChain = Promise.resolve();
    for (let i = 0; i < lessons.length; i++) {
        const makePromise = function(i: number) {
            return lessons[i].setUp();
        }
        promiseChain = promiseChain.then(makePromise(i));
    }
    //////////////////////////////[SLIDE LOGIC]//////////////////////////////
    const slides = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("mySlides");

    showSlides(slideIndex);

    // Next/previous controls
    function plusSlides(n: number) {
        showSlides(slideIndex += n);
        sendProgress();
    }

    // Thumbnail image controls
    function currentSlide(n: number) {
        showSlides(slideIndex = n);
    }

    function showSlides(n: number) {
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
    if (prev_slide) prev_slide.onclick = function() { callStop(); plusSlides(-1); }
    if (next_slide) next_slide.onclick = function() { callStop(); plusSlides(1); }

    //set up prev and next part buttons
    const prev_part = document.getElementById("prev-part");
    const next_part = document.getElementById("next-part");
    if (prev_part) {
        prev_part.onclick = function() {
            callStop();
            //window.location.href = `https://duohando.com/lesson${lesson_num}/lecture`;
        }
    }
    if (next_part) {
        next_part.onclick = function() {
            callStop();
            if (allDone()) {
                sendComplete();
            } else {
                console.log("Next: Not finished with Practice");
            }
        }
    }
}