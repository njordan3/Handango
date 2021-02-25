import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient, private toastr : ToastrService) { }

  doFacebook() {
    window.location.href = environment.domainUrl+'/facebook';
  }

  doGoogle() {
    window.location.href = environment.domainUrl+'/google';
  }

  doRegister(username: string, fname: string, lname: string, email: string, password: string) {
    this.http.post(environment.domainUrl + '/register', {
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
    this.http.post(environment.domainUrl + '/login', {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`Welcome ${resp.name}!`);
      }
    }, (errorResp) => {
      console.log(errorResp)
      this.toastr.error("Something went wrong trying to login...");
    });
  }

  logout() {
    this.http.post(environment.domainUrl + '/logout', {}, {
      withCredentials: true
    }).subscribe(() => { });
  }

  doForgotPassword(email: string) {
    this.http.post(environment.domainUrl + '/forgot-password', {
      email: email
    }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`An email with instructions has been sent to ${email}`);
      }
    }, (errorResp) => {
      this.toastr.error("Something went wrong searching for that email...");
    });
  }

  doConfirm(data: any, type: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/confirm', {
        data: data,
        type: type,
        secret: secret
      }).subscribe((resp: any) => {
        resolve(resp);
      }, (errorResp) => {
        resolve({error: "Something went wrong confirming your action..."});
      });
    });
  }

  doForgotEmail(username: string) {
    this.http.post(environment.domainUrl + '/forgot-email', {
      username: username
    }).subscribe((resp: any) => {
      if (resp.error) {
        this.toastr.error(resp.error);
      } else {
        this.toastr.success(`An email with instructions has been sent to ${username}`);
      }
    }, (errorResp) => {
      this.toastr.error("Something went wrong searching for that username...");
    });
  }

  //used in login.guard
  getLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.domainUrl + '/login', {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return resolve(false);
        } else {
          return resolve(resp.loggedIn)
        }
      }, (errorResp) => {
        console.log(errorResp);
        return resolve(false);
      })
    });
  }

  //used in lesson.guard
  getLessonUnlocked(num: number, type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/is-lesson-unlocked', {
        num: num,
        type: type
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        console.log(resp);
        return resolve(resp);
      }, (errorResp) => {
        console.log(errorResp);
        return resolve({loggedIn: false, unlocked: false});
      })
    });
  }

}