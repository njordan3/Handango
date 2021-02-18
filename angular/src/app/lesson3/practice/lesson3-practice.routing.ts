import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson3PracticeComponent } from './lesson3-practice.component';

const routes: Routes = [
  {path: "", component: Lesson3PracticeComponent}
]

export const Lesson3PracticeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
