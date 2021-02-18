import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson3LectureComponent } from './lesson3-lecture.component';

const routes: Routes = [
  {path: "", component: Lesson3LectureComponent}
]

export const Lesson3LectureRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
