import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent {

  constructor(private authService: AuthService) {}

  //https://stackoverflow.com/questions/41195708/how-to-get-form-data-in-angular-2
  doLogin(form : NgForm) {
    this.authService.doLogin(form.value.email, form.value.password);
  }

  doLogout() {
    this.authService.logout();
  }

  doFacebook() {
    console.log("Facebook");
    this.authService.doFacebook();
  }

  doGoogle() {
    console.log("Google");
    this.authService.doGoogle();
  }

}