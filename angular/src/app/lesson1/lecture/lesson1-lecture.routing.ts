import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson1LectureComponent } from './lesson1-lecture.component';

const routes: Routes = [
  {path: "", component: Lesson1LectureComponent}
]

export const Lesson1LectureRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
