import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { EqualValidator } from './equal-validator.directive';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginSignupComponent,
    RegisterComponent,
    ResetPasswordComponent,
    EqualValidator
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

//I dont know what this does, but it was causing ngOnInit twice
//platformBrowserDynamic().bootstrapModule(AppModule);