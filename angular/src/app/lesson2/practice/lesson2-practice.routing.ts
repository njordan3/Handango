import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson2PracticeComponent } from './lesson2-practice.component';

const routes: Routes = [
  {path: "", component: Lesson2PracticeComponent}
]

export const Lesson2PracticeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
