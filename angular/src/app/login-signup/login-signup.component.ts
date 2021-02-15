import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent {

  email : string = "";
  password : string = "";
  loggedIn : boolean = false;

  constructor(private authService: AuthService) {
    this.authService.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  doLogin() {
    this.authService.doLogin(this.email, this.password);
  }

  doLogout() {
    this.authService.logout();
  }

}