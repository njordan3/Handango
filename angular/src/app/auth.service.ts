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

  doLogin(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/login', {
        email: email,
        password: password
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return reject(resp.error);
        } else {
          return resolve(resp);
        }
      }, (errorResp) => {
        console.log(errorResp)
        return reject("Something went wrong trying to login...");
      });
    });
  }

  doLogin2FACheck(code: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/login2FACheck', {
        code: code
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return reject(resp.error);
        } else {
          return resolve(resp);
        }
      }, (errorResp) => {
        console.log(errorResp)
        return reject("Something went wrong trying to check login two-factor...");
      });
    });
  }

  do2FACheck(code: number ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/2FACheck', {
        code: code
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return reject(resp.error);
        } else {
          return resolve(resp);
        }
      }, (errorResp) => {
        console.log(errorResp)
        return reject("Something went wrong trying to check two-factor...");
      });
    });
  }

  doActivate2FAData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.domainUrl + '/getActivate2FAData', {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return reject(resp.error);
        } else {
          return resolve(resp);
        }
      }, (errorResp) => {
        console.log(errorResp)
        return reject("Something went wrong trying to get two-factor data...");
      });
    });
  }

  doActivate2FACheck(code: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/tryActivate2FA', {
        code: code
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          return reject(resp.error);
        } else {
          return resolve(resp);
        }
      }, (errorResp) => {
        console.log(errorResp)
        return reject("Something went wrong trying to get check two-factor activation...");
      });
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/logout', {}, {
        withCredentials: true
      }).subscribe(() => { 
        //'sleep' before going home so that there is time for the message to be seen
        setTimeout(function() {
          window.location.href = `https://duohando.com/home`;
        }, 2000);
        resolve();
      });
    });
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

  doChangePassword(data: any, just2FAd: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/changePassword', {
        password: data.password,
        password_new: data.newPassword,
        just2FAd: just2FAd
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          reject(resp.error)
        }
        resolve(resp);
      }, (errorResp) => {
        resolve({loggedIn: true, error: "Something went wrong changing your password..."});
      });
    });
  }

  doChangeEmail(data: any, just2FAd: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/changeEmail', {
        email: data.email,
        email_new: data.newEmail,
        just2FAd: just2FAd
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          reject(resp.error)
        }
        resolve(resp);
      }, (errorResp) => {
        resolve({loggedIn: true, error: "Something went wrong changing your email..."});
      });
    });
  }

  doChangeToEmail(data: any, just2FAd: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.domainUrl + '/changeToEmail', {
        email: data.email,
        password: data.password,
        username: data.username,
        just2FAd: just2FAd
      }, {
        withCredentials: true
      }).subscribe((resp: any) => {
        if (resp.error) {
          reject(resp.error)
        }
        resolve(resp);
      }, (errorResp) => {
        resolve({loggedIn: true, error: "Something went wrong changing your account to email..."});
      });
    });
  }

  doChangeToFacebook(just2FAd: boolean): void {
    window.location.href = environment.domainUrl+`/changeToFacebook?just2FAd=${just2FAd ? "true" : "false"}`;
  }

  doChangeToGoogle(just2FAd: boolean): void {
    window.location.href = environment.domainUrl+`/changeToGoogle?just2FAd=${just2FAd ? "true" : "false"}`;
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

  //used in login.guard and dashboard.guard
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