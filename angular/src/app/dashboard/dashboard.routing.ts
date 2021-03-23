import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SecuritySettingsComponent } from '../security-settings/security-settings.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

import { LessonGuard } from '../lesson.guard';
import { SettingsGuard } from '../settings.guard';

const routes: Routes = [
  {
    path: "", 
    children: [
        {path: "", pathMatch: "full", component: DashboardComponent},
        {path: "userProfile", pathMatch: "full", component: UserProfileComponent},
        {path: "securitySettings", pathMatch: "full", component: SecuritySettingsComponent},
        {path: "GuardedSettings", canActivate: [SettingsGuard]},
        {path: "Settings", pathMatch: "full", component: UserSettingsComponent},
      
        ///////////////[LESSON 1]///////////////
        {path: "lesson1", pathMatch: "full", redirectTo: "lesson1/lecture"},
        {path: "lesson1/lecture",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule) //lazy load lesson modules
        },
        {path: "lesson1/practice",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
        },
        {path: "lesson1/quiz",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
        },
        ///////////////[LESSON 2]///////////////
        {path: "lesson2", pathMatch: "full", redirectTo: "lesson2/lecture"},
        {path: "lesson2/lecture",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule)
        },
        {path: "lesson2/practice",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
        },
        {path: "lesson2/quiz",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
        },
        ///////////////[LESSON 3]///////////////
        {path: "lesson3", pathMatch: "full", redirectTo: "lesson3/lecture"},
        {path: "lesson3/lecture",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule)
        },
        {path: "lesson3/practice",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
        },
        {path: "lesson3/quiz",
          canLoad: [LessonGuard],
          loadChildren: () => import('../lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
        },
        ////////////////////////////////////////
    ]
  }
]

export const DashboardRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);