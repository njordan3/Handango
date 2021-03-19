import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetEmailComponent } from './forget-email/forget-email.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

import { LoginGuard } from './login.guard';
import { LessonGuard } from './lesson.guard';
import { VerifyGuard } from './verify.guard';
import { from } from 'rxjs';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "/home"},
  {path: "home", component: HomeComponent},
  {path: "loginSignup", canActivate: [LoginGuard], component: LoginSignupComponent},
  {path: "register", component: RegisterComponent},
  {path: "resetPassword", component: ResetPasswordComponent},
  {path: "dashboard", pathMatch: "full", redirectTo: "/home"},
  {path: "forgetEmail", component: ForgetEmailComponent},
  {path: "verify", canActivate: [VerifyGuard]},
  {path: "confirm", component: ConfirmComponent},
  {path: "userProfile", component: UserProfileComponent},
  {path: "securitySettings", component: SecuritySettingsComponent},
  {path: "Settings", component: UserSettingsComponent},

  ///////////////[LESSON 1]///////////////
  {path: "lesson1", pathMatch: "full", redirectTo: "lesson1/lecture"},
  {path: "lesson1/lecture",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule) //lazy load lesson modules
  },
  {path: "lesson1/practice",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
  },
  {path: "lesson1/quiz",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
  },
  ///////////////[LESSON 2]///////////////
  {path: "lesson2", pathMatch: "full", redirectTo: "lesson2/lecture"},
  {path: "lesson2/lecture",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule)
  },
  {path: "lesson2/practice",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
  },
  {path: "lesson2/quiz",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
  },
  ///////////////[LESSON 3]///////////////
  {path: "lesson3", pathMatch: "full", redirectTo: "lesson3/lecture"},
  {path: "lesson3/lecture",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/lecture/lesson-lecture.module').then(m => m.LessonLectureModule)
  },
  {path: "lesson3/practice",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/practice/lesson-practice.module').then(m => m.LessonPracticeModule)
  },
  {path: "lesson3/quiz",
    canLoad: [LessonGuard],
    loadChildren: () => import('./lessons/quiz/lesson-quiz.module').then(m => m.LessonQuizModule)
  },
  ////////////////////////////////////////
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
