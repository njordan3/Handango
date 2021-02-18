import { NgModule } from '@angular/core';
import { Lesson1LectureRouting } from './lesson1-lecture.routing';
import { Lesson1LectureComponent } from './lesson1-lecture.component';

@NgModule({
  declarations: [
    Lesson1LectureComponent
  ],
  imports: [
    Lesson1LectureRouting
  ]
})
export class Lesson1LectureModule { }
