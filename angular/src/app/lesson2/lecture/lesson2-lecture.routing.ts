import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson2LectureComponent } from './lesson2-lecture.component';

const routes: Routes = [
  {path: "", component: Lesson2LectureComponent}
]

export const Lesson2LectureRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
