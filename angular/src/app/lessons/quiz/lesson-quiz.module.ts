import { NgModule } from '@angular/core';
import { LessonQuizRouting } from './lesson-quiz.routing';
import { LessonQuizComponent } from './lesson-quiz.component';
import { LessonQuizNextModal } from './modals/lesson-quiz-next-modal.component';
import { CommonModule } from '@angular/common';  

@NgModule({
  declarations: [
    LessonQuizComponent,
    LessonQuizNextModal
  ],
  imports: [
    LessonQuizRouting,
    CommonModule
  ]
})
export class LessonQuizModule { }
