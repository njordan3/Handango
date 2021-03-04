import {io} from 'socket.io-client';
import { environment } from './../../../environments/environment';

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

var buttonInfo: any;
export function launch(slide: number): Promise<void> {
    return new Promise((resolve, reject) => {
        //dynamic import lesson slides
        import(`./lesson${lesson_num}-lecture.html`).then(lecture => {
            document.getElementsByClassName('slideshow-container')[0].innerHTML += lecture.html;
            buttonInfo = lecture.buttonInfo;

            //////////////////////////////[SLIDE LOGIC]//////////////////////////////
            slideIndex = slide;

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
            return resolve();
        });
    })
    
}

export function complete() {
    if (environment.live)
        window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
    else
        window.location.href = `http://localhost:4200/lesson${lesson_num}/practice`;
}

export function goBack() {
    if (environment.live)
        window.location.href = `https://duohando.com/dashboard`;
    else
        window.location.href = `http://localhost:4200/dashboard`;
}

export function getButtonInfo(): any {
    let button = document.getElementById("1") as HTMLInputElement;
    return buttonInfo[button.value];
}