import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonLectureComponent } from './lesson-lecture.component';

const routes: Routes = [
  {path: "", component: LessonLectureComponent}
]

export const LessonLectureRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
