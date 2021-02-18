import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson2QuizComponent } from './lesson2-quiz.component';

const routes: Routes = [
  {path: "", component: Lesson2QuizComponent}
]

export const Lesson2QuizRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
