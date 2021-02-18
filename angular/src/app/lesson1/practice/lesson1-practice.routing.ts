import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson1PracticeComponent } from './lesson1-practice.component';

const routes: Routes = [
  {path: "", component: Lesson1PracticeComponent}
]

export const Lesson1PracticeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
