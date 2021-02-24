import { NgModule } from '@angular/core';
import { LessonPracticeRouting } from './lesson-practice.routing';
import { LessonPracticeComponent } from './lesson-practice.component';
import { LessonPracticeNextModal } from './modals/lesson-practice-next-modal.component';
import { LessonPracticePrevModal } from './modals/lesson-practice-prev-modal.component';
import { CommonModule } from '@angular/common';  

@NgModule({
  declarations: [
    LessonPracticeComponent,
    LessonPracticeNextModal,
    LessonPracticePrevModal
  ],
  imports: [
    LessonPracticeRouting,
    CommonModule
  ]
})
export class LessonPracticeModule { }
