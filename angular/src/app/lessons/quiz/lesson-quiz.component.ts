import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { launch } from './lesson-quiz';
import { Router, ActivatedRoute } from '@angular/router';
import { pauseTimer } from './lesson-quiz';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonQuizNextModal } from './modals/lesson-quiz-next-modal.component';
import { LessonQuizPrevModal } from './modals/lesson-quiz-prev-modal.component';

@Component({
  selector: 'Lesson-quiz',
  templateUrl: '../lesson.component.html',
  styleUrls: ['../lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class LessonQuizComponent implements OnInit {
  type: string = "";
  lesson_num: number = 1;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.type = "Quiz";
  }

  ngOnInit(): void {
    //grab route data set in lesson.guard
    this.activatedRoute.data.subscribe(data => {
      this.lesson_num = data.lesson_num;
      console.log(data);
      launch(data.lesson, data.time); //build all the lessons after the HTML template has loaded

      let that = this;
      
      var next_part = document.getElementById("next-part");
      if (next_part) {
        next_part.innerHTML = "Submit the Quiz";

        next_part.onclick = function() {
          pauseTimer();
          LessonQuizNextModal.updateResults();
          that.modalService.open(LessonQuizNextModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
        }
      }

      var prev_part = document.getElementById("prev-part");
      if (prev_part) {
          prev_part.innerHTML = "Practice some more";
          prev_part.onclick = function() {
            pauseTimer();
            that.modalService.open(LessonQuizPrevModal, { centered: true, animation: true, keyboard: false, backdrop: 'static'});
          }
      }
    });
  }
}
