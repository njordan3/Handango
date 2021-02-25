import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyGuard implements CanActivate {

  constructor(private router: Router, private route: ActivatedRoute, private toastr : ToastrService, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let param = route.queryParams;
      if (environment.live) {
        if (param.pcs &&  param.pcs.length === 128 && Object.keys(param).length === 1) {
          this.router.navigate(['/confirm'], { relativeTo: this.route, state: route.queryParams});
          return resolve(true);
        } else if(param.pds && param.pds.length === 128 && Object.keys(param).length === 1 ||
                  param.eds && param.eds.length === 128 && Object.keys(param).length === 1 ||
                  param.evs && param.evs.length === 128 && Object.keys(param).length === 1) {
          let type: string = Object.keys(param)[0];
          this.authService.doConfirm({}, type, param[type])
            .then((resp) => {
              this.router.navigate(['/confirm'], { relativeTo: this.route, state: resp});
              return resolve(true);
            })
        } else {
          return resolve(false);
        }
      } else {
        if (param.pcs) {
          this.router.navigate(['/confirm'], { relativeTo: this.route, state: route.queryParams});
          return resolve(true);
        } else if (param.evs || param.pds || param.eds) {
          this.router.navigate(['/confirm'], { relativeTo: this.route, state: {message: "Confirm Message"}});
          return resolve(true);
        } else {
          return resolve(false);
        }
      }
    });
  }
}
