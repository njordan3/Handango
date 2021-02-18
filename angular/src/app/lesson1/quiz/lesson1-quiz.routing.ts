import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson1QuizComponent } from './lesson1-quiz.component';

const routes: Routes = [
  {path: "", component: Lesson1QuizComponent}
]

export const Lesson1QuizRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
