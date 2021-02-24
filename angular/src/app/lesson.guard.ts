import { Injectable } from '@angular/core';
import { CanLoad, Router, ActivatedRoute, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LessonGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private toastr : ToastrService) { }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getLessonUnlocked(parseInt(segments[0].path[6]), segments[1].path)  //param1 gets the lesson number
        .then((resp) => {
          if (resp.loggedIn) {
            if (!resp.unlocked) {
              this.router.navigate(['/dashboard'], { relativeTo: this.route });
              this.toastr.error(resp.message);
              return resolve(false);
            }
            route.data = {lesson: resp.lesson, slide: resp.slide, lesson_num: segments[0].path[6]};
            return resolve(true);
          } else {
            this.router.navigate(['/loginSignup'], { relativeTo: this.route, });
            this.toastr.error(resp.message);
            return resolve(false);
          }
        });
    });
  }
}