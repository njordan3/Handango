import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "/home"},
  {path: "home", component: HomeComponent},
  {path: "loginSignup", component: LoginSignupComponent},
  {path: "register", component: RegisterComponent},
  ///////////////[LESSON 1]///////////////
  {path: "lesson1", pathMatch: "full", redirectTo: "lesson1/lecture"},
  {path: "lesson1/lecture",
    loadChildren: () => import('./lesson1/lecture/lesson1-lecture.module').then(m => m.Lesson1LectureModule) //lazy load lesson modules
  },
  {path: "lesson1/practice",
    loadChildren: () => import('./lesson1/practice/lesson1-practice.module').then(m => m.Lesson1PracticeModule)
  },
  {path: "lesson1/quiz",
    loadChildren: () => import('./lesson1/quiz/lesson1-quiz.module').then(m => m.Lesson1QuizModule)
  },
  ///////////////[LESSON 2]///////////////
  {path: "lesson2", pathMatch: "full", redirectTo: "lesson2/lecture"},
  {path: "lesson2/lecture",
    loadChildren: () => import('./lesson2/lecture/lesson2-lecture.module').then(m => m.Lesson2LectureModule)
  },
  {path: "lesson2/practice",
    loadChildren: () => import('./lesson2/practice/lesson2-practice.module').then(m => m.Lesson2PracticeModule)
  },
  {path: "lesson2/quiz",
    loadChildren: () => import('./lesson2/quiz/lesson2-quiz.module').then(m => m.Lesson2QuizModule)
  },
  ///////////////[LESSON 3]///////////////
  {path: "lesson3", pathMatch: "full", redirectTo: "lesson3/lecture"},
  {path: "lesson3/lecture",
    loadChildren: () => import('./lesson3/lecture/lesson3-lecture.module').then(m => m.Lesson3LectureModule)
  },
  {path: "lesson3/practice",
    loadChildren: () => import('./lesson3/practice/lesson3-practice.module').then(m => m.Lesson3PracticeModule)
  },
  {path: "lesson3/quiz",
    loadChildren: () => import('./lesson3/quiz/lesson3-quiz.module').then(m => m.Lesson3QuizModule)
  },
  ////////////////////////////////////////
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
