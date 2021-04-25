import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { launch } from './lesson-practice';
import { ActivatedRoute } from '@angular/router';
import { callStop } from './lesson-practice';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonPracticeNextModal } from './modals/lesson-practice-next-modal.component';
import { LessonPracticePrevModal } from './modals/lesson-practice-prev-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'Lesson-practice',
  templateUrl: '../lesson.component.html',
  styleUrls: ['../lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class LessonPracticeComponent implements OnInit, OnDestroy {
  type: string = "";
  lesson_num: number = 1;

  private subscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal) {
    this.type = "Practice";
  }

  ngOnInit(): void {
    //grab route data set in lesson.guard
    this.subscription = this.activatedRoute.data.subscribe(data => {
      console.log(data)
      this.lesson_num = data.lesson_num;
      launch(data.lesson, data.slide); //build all the lessons after the HTML template has loaded

      let that = this;
      
      var next_part = document.getElementById("next-part");
      if (next_part) {
        next_part.innerHTML = "Take the Quiz";

        next_part.onclick = function() {
          callStop();
          LessonPracticeNextModal.updateResults();
          that.modalService.open(LessonPracticeNextModal, { centered: true, animation: true });
        }
      }

      //set up prev and next part buttons
      var prev_part = document.getElementById("prev-part");
      if (prev_part) {
          prev_part.innerHTML = "Return to the Lecture";
          prev_part.onclick = function() {
              callStop();
              LessonPracticePrevModal.updateResults();
              that.modalService.open(LessonPracticePrevModal, { centered: true, animation: true });
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}