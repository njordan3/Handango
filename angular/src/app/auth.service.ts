import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn : Subject<boolean>;

  constructor(private http : HttpClient, private toastr : ToastrService) {
    this.loggedIn = new Subject();
    //this.getLogin();
  }

  doFacebook() {
    //window.location.href = environment.domainUrl+'/facebook';
  }

  doGoogle() {
    //window.location.href = environment.domainUrl+'/google';
  }

  doRegister(username: string, fname: string, lname: string, email: string, password: string) {
    this.http.post(environment.localUrl + '/register', {
      username: username,
      firstname: fname,
      lastname: lname,
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`Your new account has been created!`);
      }
    }, (errorResp) => {
      this.toastr.error("Something went wrong trying to register...");
    });
  }

  doLogin(email: string, password: string) {
    this.http.post(environment.localUrl + '/login', {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`Welcome ${resp.username}!`);
        this.loggedIn.next(true);
      }
    }, (errorResp) => {
      this.loggedIn.next(false);
      this.toastr.error("Something went wrong trying to login...");
    });
  }

  getLogin() {
    this.http.get(environment.localUrl + '/login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      if (resp.error) {
        console.log(resp.error);
      } else {
        (resp.loggedIn) ? console.log("Already logged in") : console.log("Not logged in");
        this.loggedIn.next(resp.loggedIn);
      }
    }, (errorResp) => {
      console.log(errorResp);
    })
  }

  logout() {
    this.http.post(environment.localUrl + '/logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this.loggedIn.next(false);
    });
  }

  doForgotPassword(email: string) {
    this.http.post(environment.localUrl + '/forgot-password', {
      email: email
    }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`An email with instructions has been sent to ${email}`);
      }
    }, (errorResp) => {
      this.toastr.error("Something went wrong changing your password...");
    });
  }
}