import { Injectable } from '@angular/core';
import { CanLoad, Router, ActivatedRoute, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private toastr : ToastrService) { }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> | boolean {
    if (environment.live) {
      return new Promise((resolve, reject) => {
        this.authService.getLessonUnlocked(parseInt(segments[0].path[6]), segments[1].path)  //param1 gets the lesson number
          .then((resp) => {
            if (resp.loggedIn) {
              if (!resp.unlocked) {
                this.router.navigate(['/dashboard'], { relativeTo: this.route });
                this.toastr.error(resp.message);
                return resolve(false);
              }
              route.data = {lesson: resp.lesson, slide: resp.slide, lesson_num: segments[0].path[6], time: resp.time};
              return resolve(true);
            } else {
              this.router.navigate(['/loginSignup'], { relativeTo: this.route, });
              this.toastr.error(resp.message);
              return resolve(false);
            }
          });
      });
    } else {
      route.data = {lesson: [
        {type: "WebCam", phrase: "G"},
        {type: "DragDrop", phrases: ["J", "B", "Z"]},
        {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
        {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
        {type: "MultipleChoice", phrases: [
          {
              question: "Question 1?",
              choices:    [
                  "Choice 1",
                  "Choice 2",
                  "Choice 3",
                  "Choice 4",
              ],
              correct: 1
          },
          {
              question: "Question 2?",
              choices:    [
                  "Choice 1",
                  "Choice 2",
                  "Choice 3",
                  "Choice 4",
              ],
              correct: 3
          },
          {
              question: "Question 3?",
              choices:    [
                  "Choice 1",
                  "Choice 2",
                  "Choice 3",
                  "Choice 4",
              ],
              correct: 0
          }
      ]}
      ], slide: 1, lesson_num: segments[0].path[6], time: 10};
      return true;
    }
  }
}