import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { LessonLectureRouting } from './lesson-lecture.routing';
import { LessonLectureComponent } from './lesson-lecture.component';
import { LessonLectureNextModal } from './modals/lesson-lecture-next-modal.component';
import { LessonLecturePrevModal } from './modals/lesson-lecture-prev-modal.component';
import { LessonLectureInfoButtonModal, SafePipe } from './modals/lesson-lecture-info-button-modal.component';

@NgModule({
  declarations: [
    LessonLectureComponent,
    SafePipe,
    LessonLectureNextModal,
    LessonLecturePrevModal,
    LessonLectureInfoButtonModal
  ],
  imports: [
    LessonLectureRouting,
    CommonModule
  ]
})
export class LessonLectureModule { }
