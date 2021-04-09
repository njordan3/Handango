import { io } from 'socket.io-client';
import { environment } from './../../../environments/environment';
import { LessonQuizCompleteModal } from './modals/lesson-quiz-complete-modal.component';

import { DragDrop } from 'src/assets/ts/drag-drop';
import { DragDropNumbers } from 'src/assets/ts/drag-drop-numbers';
import { DragDropQuestions } from 'src/assets/ts/drag-drop-questions';
import { FingerSpelling } from 'src/assets/ts/fingerspelling';
import { FingerSpellingNumbers } from 'src/assets/ts/fingerspelling-numbers';
import { FingerSpellingInterp } from 'src/assets/ts/fingerspelling-interp';
import { FingerSpellingInterpNumbers } from 'src/assets/ts/fingerspelling-interp-numbers';
import { FingerSpellingInterpQuestions } from 'src/assets/ts/fingerspelling-interp-questions';
import { MultipleChoice } from 'src/assets/ts/multiple-choice';
import { Webcam } from 'src/assets/ts/web-cam';
import { SelectQuestions } from 'src/assets/ts/select-questions';

//get lesson info from URL
let lesson_num: number;
let part: string;

//////////////////////////////[SOCKET.IO]//////////////////////////////
var socket = io('https://duohando.com:3000', {
    withCredentials: true
});


socket.on('complete-confirmation', function(data: any) {
    LessonQuizCompleteModal.submitScore(data);
});


export function sendComplete() {
    if (environment.live) {
        let grade = getAnswers();
        let time = {min: getMinutes(distance), sec: getSeconds(distance)};
        socket.emit(`quiz-complete`, {lesson: lesson_num, grade: grade, time: time});
    } else {
        window.location.href = "http://localhost:4200/dashboard";
    }
}

////////////////////////////[TIMER SETUP]////////////////////////////
var countDownDate: Date;
var timer: any;
var timerElem: HTMLElement|null;
var now: number;
var distance: number;
var timerDone: boolean = false;
var paused = false;
var pauseTime: any = {min: 0, sec: 0};
function getMinutes(distance: number) { return Math.floor((distance % 3600000) / (60000)); }
function getSeconds(distance: number) { return Math.floor((distance % 60000) / 1000); }
function setupTimer(time: number) {
    countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + time);
    now = new Date().getTime();
    distance = countDownDate.getTime() - now;

    //set up initial timer display
    timerElem = document.getElementById("timer");
    if (timerElem)
        timerElem.innerHTML = `${getMinutes(distance)}m ${getSeconds(distance)}s`;
}

export function startTimer() {
    if (!timerDone) {
        if (paused) {   //timer gets started again
            countDownDate.setMinutes(countDownDate.getMinutes() + pauseTime.min - getMinutes(distance));
            countDownDate.setSeconds(countDownDate.getSeconds() + pauseTime.sec - getSeconds(distance));
            paused = false;
        } else {
            //update time every 1 second
            timer = setInterval(function() {
                // Find the distance between now and the count down date
                now = new Date().getTime();
                distance = countDownDate.getTime() - now;
                if (!paused) {
                    if (timerElem)
                        timerElem.innerHTML = `${getMinutes(distance)}m ${getSeconds(distance)}s`;

                    if (distance < 0) {
                        timerDone = true;
                        clearInterval(timer);
                        if (timerElem)
                            timerElem.innerHTML = "TIME'S UP";
                    }
                }
            }, 1000);
        }
    }
}

export function pauseTimer() {
    pauseTime = {min: getMinutes(distance), sec: getSeconds(distance)};
    paused = true;
}

//////////////////////////////[Lesson Setup]//////////////////////////////
var slideIndex = 1;
var lessons: any[] = [];
export function launch(data: any, time: number): void {

    lesson_num = parseInt(window.location.pathname.split('/')[2].charAt(6));
    part = window.location.pathname.split('/')[3];

    for (let i = 0; i < Object.keys(data).length; i++) {
        switch(data[i].type) {
            case "DragDrop":
                lessons.push(new DragDrop(data[i].phrases));
                break;
            case "FingerSpellingInterp":
                lessons.push(new FingerSpellingInterp(data[i].phrases));
                break;
            case "FingerSpelling":
                lessons.push(new FingerSpelling(data[i].phrases));
                break;
            case "MultipleChoiceNumbers":
            case "MultipleChoiceQuestions":
            case "MultipleChoice":
                lessons.push(new MultipleChoice(data[i].phrases));
                break;
            case "WebCam":
                lessons.push(new Webcam(data[i].phrase[0], socket));
                break;
            case "DragDropNumbers":
                lessons.push(new DragDropNumbers(data[i].phrases));
                break;
            case "DragDropQuestions":
                lessons.push(new DragDropQuestions(data[i].phrases));
                break;
            case "FingerSpellingNumbers":
                lessons.push(new FingerSpellingNumbers(data[i].phrases));
                break;
            case "FingerSpellingInterpNumbers":
                lessons.push(new FingerSpellingInterpNumbers(data[i].phrases));
                break;
            case "FingerSpellingInterpQuestions":
                lessons.push(new FingerSpellingInterpQuestions(data[i].phrases));
                break;
            case "SelectQuestions":
                lessons.push(new SelectQuestions(data[i].phrases));
                break;
            default:
                console.log(`can't load practice type: ${data[i].type}`);
        }
    }
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
        if (n > 0) slideIndex++;
        else slideIndex--;
        showSlides(slideIndex);
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

    //setup prev and next slide buttons
    const prev_slide = document.getElementById("prev-slide");
    const next_slide = document.getElementById("next-slide");
    if (prev_slide) prev_slide.onclick = function() { callStop(); plusSlides(-1); }
    if (next_slide) next_slide.onclick = function() { callStop(); plusSlides(1); }

    setupTimer(time);
    startTimer();
}

//stops any webcam that is running in a slide
export function callStop() {
    for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].stop !== undefined) {
            lessons[i].stop();
        }
    }
}

//collects the current state of answers to send to the Modal
export function getAnswers(): any {
    let result = {answers_count: 0, answers_correct: 0};
    for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].answers_count)
            result.answers_count += lessons[i].answers_count;
        if (lessons[i].answers_correct)
            result.answers_correct += lessons[i].answers_correct;
    }
    return result;
}

export function goBack() {
    callStop();
    if (environment.live)
        window.location.href = `https://duohando.com/dashboard/lesson${lesson_num}/practice`;
    else
        window.location.href = `http://localhost:4200/dashboard/lesson${lesson_num}/practice`;
}