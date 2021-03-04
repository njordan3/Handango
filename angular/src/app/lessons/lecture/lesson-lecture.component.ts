import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { launch } from './lesson-lecture';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonLectureNextModal } from './modals/lesson-lecture-next-modal.component';
import { LessonLecturePrevModal } from './modals/lesson-lecture-prev-modal.component';
import { LessonLectureInfoButtonModal } from './modals/lesson-lecture-info-button-modal.component';

@Component({
  selector: 'lesson-lecture',
  templateUrl: '../lesson.component.html',
  styleUrls: ['../lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class LessonLectureComponent implements OnInit {
  type: string = "";
  lesson_num: number = 1;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.type = "Lecture";
  }

  ngOnInit(): void {
      //grab route data set in lesson.guard
      this.activatedRoute.data.subscribe(data => {
        this.lesson_num = data.lesson_num;
        launch(data.slide)  //build all the lessons after the HTML template has loaded
          .then(() => {
            let that = this;

            var next_part = document.getElementById("next-part");
            if (next_part) {
              next_part.innerHTML = "Continue to Practice";
    
              next_part.onclick = function() {
                that.modalService.open(LessonLectureNextModal, { centered: true, animation: true });
              }
            }
    
            var prev_part = document.getElementById("prev-part");
            if (prev_part) {
                prev_part.innerHTML = "Return to Dashboard";
    
                prev_part.onclick = function() {
                  that.modalService.open(LessonLecturePrevModal, { centered: true, animation: true });
                }
            }

            var infoButtons = document.getElementsByClassName('info-button');
            for (let i = 0; i < infoButtons.length; i++) {
                let button = infoButtons[i];
                if (button) {
                    button.addEventListener('click', function(e) {
                        let lastTarget = document.getElementById("1");
                        if (lastTarget) {
                          lastTarget.id = "";
                          lastTarget.classList.remove("last-button");
                          lastTarget.classList.add("visited-button");
                        }
                        let target = e.target as HTMLInputElement;
                        target.id = "1";
                        target.classList.remove("visited-button");
                        target.classList.add("last-button");
                        that.modalService.open(LessonLectureInfoButtonModal, { centered: true, animation: true, size: "lg"});
                    });
                }
            }
          });
      });
  }
}
