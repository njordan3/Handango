import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Subject} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
    window.location.href = environment.domainUrl+'/facebook';
  }

  doGoogle() {
    window.location.href = environment.domainUrl+'/google';
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
      console.log(errorResp);
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
}