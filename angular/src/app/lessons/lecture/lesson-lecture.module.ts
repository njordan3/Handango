import { NgModule } from '@angular/core';

import { LessonLectureRouting } from './lesson-lecture.routing';
import { LessonLectureComponent } from './lesson-lecture.component';

@NgModule({
  declarations: [
    LessonLectureComponent
  ],
  imports: [
    LessonLectureRouting
  ]
})
export class LessonLectureModule { }
