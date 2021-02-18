import { NgModule } from '@angular/core';
import { Lesson1QuizRouting } from './lesson1-quiz.routing';
import { Lesson1QuizComponent } from './lesson1-quiz.component';

@NgModule({
  declarations: [
    Lesson1QuizComponent
  ],
  imports: [
    Lesson1QuizRouting
  ]
})
export class Lesson1QuizModule { }
