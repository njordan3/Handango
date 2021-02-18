import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson3QuizComponent } from './lesson3-quiz.component';

const routes: Routes = [
  {path: "", component: Lesson3QuizComponent}
]

export const Lesson3QuizRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
