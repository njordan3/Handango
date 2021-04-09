import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class DashboardService {

  private FirstName: BehaviorSubject<string>|null = null;
  sharedFirstName: Observable<string>|null = null;

  private LastName: BehaviorSubject<string>|null = null;
  sharedLastName: Observable<string>|null = null;

  private Email: BehaviorSubject<string>|null = null;
  sharedEmail: Observable<string>|null = null;

  private LastLogin: BehaviorSubject<string>|null = null;
  sharedLastLogin: Observable<string>|null = null;

  private CreateTime: BehaviorSubject<string>|null = null;
  sharedCreateTime: Observable<string>|null = null;

  private AccountType: BehaviorSubject<string|null>|null = null;
  sharedAccountType: Observable<string|null>|null = null;

  private Username: BehaviorSubject<string>|null = null;
  sharedUsername: Observable<string>|null = null;

  private TwoFactored: BehaviorSubject<boolean>|null = null;
  sharedTwoFactored: Observable<boolean>|null = null;
  
  private Lessons: BehaviorSubject<any>|null = null;
  sharedLessons: Observable<any>|null = null;

  private loaded: boolean = false;

  constructor(private http : HttpClient, private toastr : ToastrService) { }

  getUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (environment.live) {
        if (!this.loaded) {
          this.http.get(environment.domainUrl + '/userInfo', {
            withCredentials: true
          }).subscribe((resp: any) => {
            console.log(resp);
            if (resp.err) {
              this.toastr.error(resp.err);
              reject();
            } else {
              this.FirstName = new BehaviorSubject(resp.fname); this.sharedFirstName = this.FirstName.asObservable();
              this.LastName = new BehaviorSubject(resp.lname); this.sharedLastName = this.LastName.asObservable();
              this.Email = new BehaviorSubject(resp.email); this.sharedEmail = this.Email.asObservable();
              this.LastLogin = new BehaviorSubject(resp.last_login); this.sharedLastLogin = this.LastLogin.asObservable();
              this.CreateTime = new BehaviorSubject(resp.create_time); this.sharedCreateTime = this.CreateTime.asObservable();
              this.AccountType = new BehaviorSubject<string|null>(resp.type); this.sharedAccountType = this.AccountType.asObservable();
              this.Username = new BehaviorSubject(resp.username); this.sharedUsername = this.Username.asObservable();
              this.TwoFactored = new BehaviorSubject<boolean>(resp.two_factored); this.sharedTwoFactored = this.TwoFactored.asObservable();
              this.Lessons = new BehaviorSubject<any>(resp.lessons); this.sharedLessons = this.Lessons.asObservable();
              this.loaded = true;
              resolve();
            }
          }, (errorResp) => {
            this.toastr.error("Something went wrong fetching user info...");
            reject();
          });
        } else {
          resolve();
        }
      } else {
        this.FirstName = new BehaviorSubject("John"); this.sharedFirstName = this.FirstName.asObservable();
        this.LastName = new BehaviorSubject("Doe"); this.sharedLastName = this.LastName.asObservable();
        this.Email = new BehaviorSubject("jdoe@email.com"); this.sharedEmail = this.Email.asObservable();
        this.LastLogin = new BehaviorSubject("2021-04-23 12:05:13"); this.sharedLastLogin = this.LastLogin.asObservable();
        this.CreateTime = new BehaviorSubject("2021-03-23 22:51:13"); this.sharedCreateTime = this.CreateTime.asObservable();
        this.AccountType = new BehaviorSubject<string|null>(null); this.sharedAccountType = this.AccountType.asObservable();
        this.Username = new BehaviorSubject("user123"); this.sharedUsername = this.Username.asObservable();
        this.TwoFactored = new BehaviorSubject<boolean>(false); this.sharedTwoFactored = this.TwoFactored.asObservable();
        this.Lessons = new BehaviorSubject<any>([
          {
            lesson_id: 1,
            unlock_date: "2021-04-08 23:28:00",
            desc: 'Learn the Alphabet and Fingerspelling in ASL',
            practice_complete: 1,
            quiz_passed: 1,
            last_score: 13532,
            last_grade: 94,
            last_time: {min: "6", sec: "54"}
          },
          {
            lesson_id: 2,
            unlock_date: "2021-04-08 23:28:00",
            desc: 'Learn Numbers and Counting in ASL',
            practice_complete: 1,
            quiz_passed: 1,
            last_score: 12643,
            last_grade: 89,
            last_time: {min: "6", sec: "54"}
          },
          {
            lesson_id: 3,
            unlock_date: "2021-04-08 23:28:00",
            desc: 'Learn Types of Questions in ASL',
            practice_complete: 0,
            quiz_passed: 0,
            last_score: 0,
            last_grade: 0,
            last_time: null
          }
        ]); this.sharedLessons = this.Lessons.asObservable();
        resolve();
      }
    });
  }
}
