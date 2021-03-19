import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetEmailComponent } from './forget-email/forget-email.component';
import { ConfirmComponent } from './confirm/confirm.component';

import { LoginGuard } from './login.guard';
import { VerifyGuard } from './verify.guard';
import { DashboardGuard } from './dashboard.guard';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "/home"},
  {path: "home", component: HomeComponent},
  {path: "loginSignup", canActivate: [LoginGuard], component: LoginSignupComponent},
  {path: "register", component: RegisterComponent},
  {path: "resetPassword", component: ResetPasswordComponent},
  {path: "forgetEmail", component: ForgetEmailComponent},
  {path: "verify", canActivate: [VerifyGuard]},
  {path: "confirm", component: ConfirmComponent},
  {path: "dashboard",
    canLoad: [DashboardGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) //lazy load dashboard on login
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
