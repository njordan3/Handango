import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonQuizComponent } from './lesson-quiz.component';

const routes: Routes = [
  {path: "", component: LessonQuizComponent}
]

export const LessonQuizRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
