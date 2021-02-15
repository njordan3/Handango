import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn : Subject<boolean>;

  constructor(private http : HttpClient) {
    this.loggedIn = new Subject();
    this.getLogin();
  }

  doLogin(email: string, password: string) {
    this.http.post(environment.url + '/login', {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      this.loggedIn.next(true);
      console.log(resp);
    }, (errorResp) => {
      this.loggedIn.next(false);
      console.log(errorResp);
    });
  }

  getLogin() {
    this.http.get(environment.url + '/login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      this.loggedIn.next(resp.loggedIn);
      console.log(resp);
    }, (errorResp) => {
      console.log(errorResp);
    })
  }

  logout() {
    this.http.post(environment.url + '/logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this.loggedIn.next(false);
    });
  }
}