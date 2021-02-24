import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonPracticeComponent } from './lesson-practice.component';

const routes: Routes = [
  {path: "", component: LessonPracticeComponent}
]

export const LessonPracticeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
