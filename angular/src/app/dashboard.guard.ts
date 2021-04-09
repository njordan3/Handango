import { Injectable } from '@angular/core';
import { CanLoad, Router, ActivatedRoute, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private toastr : ToastrService) { }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> | boolean {
    if (environment.live) {
      return new Promise((resolve, reject) => {
        this.authService.getLogin()
          .then((loggedIn) => {
            if (loggedIn) {
              let welcomeName = this.router.getCurrentNavigation()?.extractedUrl.queryParams.fname; 
              if (welcomeName) {
                this.router.navigate(['/dashboard'], { relativeTo: this.route });
                this.toastr.success(`Welcome ${welcomeName}!`);
              } else {
                resolve(true);
              }
            } else {
              this.toastr.error("Login to reach your dashboard.");
              resolve(false);
            }
          })
      });
    } else {
      return true;
    }
  }
  
}
