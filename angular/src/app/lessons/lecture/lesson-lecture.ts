import {io} from 'socket.io-client';

//get lesson info from URL
let lesson_num: number = parseInt(window.location.pathname.split('/')[1].charAt(6));
let part: string = window.location.pathname.split('/')[2];

var slideIndex: number = 1;
//////////////////////////////[SOCKET.IO]//////////////////////////////
var socket = io('https://duohando.com:3000', {
    withCredentials: true
});

function sendProgress() {
    let msg = {
        lesson: lesson_num,
        slide: slideIndex
    }
    socket.emit(`${part}-progress`, msg);
}

export function launch(slide: number): void {
    slideIndex = slide;

    //////////////////////////////[SLIDE LOGIC]//////////////////////////////
    //blank slides for testing
    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName('slideshow-container')[0].innerHTML += `<div class="mySlides"><p>${i+1}</p></div>`;
    }

    const slides = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("mySlides");

    showSlides(slideIndex);

    // Next/previous controls
    function plusSlides(n: number) {
        if (n > 0) slideIndex++;
        else slideIndex--;
        showSlides(slideIndex);
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

    //setup prev and next slide buttons
    const prev_slide = document.getElementById("prev-slide");
    const next_slide = document.getElementById("next-slide");
    if (prev_slide) prev_slide.onclick = function() { plusSlides(-1); }
    if (next_slide) next_slide.onclick = function() { plusSlides(1); }
}

export function complete() {
    window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
}

export function goBack() {
    window.location.href = `https://duohando.com/dashboard`;
}