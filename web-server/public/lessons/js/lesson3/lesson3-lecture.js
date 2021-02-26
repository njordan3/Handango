let lesson_num = window.location.pathname.split('/')[1].charAt(6);
let part = window.location.pathname.split('/')[2];

if (part === 'lecture' && lesson_num == 3) {
    const slides = document.getElementsByClassName("mySlides");

    var slideIndex = parseInt(document.getElementById('current-slide').innerHTML !== undefined ? document.getElementById('current-slide').innerHTML : 1);
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
        window.location.href = "https://duohando.com/dashboard";
    }
    next_part.onclick = function() {
        window.location.href = `https://duohando.com/lesson${lesson_num}/practice`;
    }
} else {
    console.log(`This is lesson3-lecture.js in lesson ${lesson_num} ${part}`);
}