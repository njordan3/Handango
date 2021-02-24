import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    if (environment.production) {
      return new Promise((resolve, reject) => {
        this.authService.getLogin()
          .then((loggedIn) => {
            if (state.url.split('/')[1] === "loginSignup") {  //zero index will be ""
              if (loggedIn) { //if logged in and at loginSignup, then redirect to dashboard
                this.router.navigate(['/dashboard'], { relativeTo: this.route });
                return resolve(false);
              }
              return resolve(true);
            } else {
              if (!loggedIn) {  //if not logged in and not at loginSignup, then redirect to loginSignup
                this.router.navigate(['/loginSignup'], { relativeTo: this.route });
                return resolve(false);
              }
              return resolve(true);
            }
          });
      });
    } else {
      return true;
    }
  }
}
