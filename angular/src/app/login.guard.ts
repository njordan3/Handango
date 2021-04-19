import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from './../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Login2FAModal } from './two-factor-auth/login-2FA-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private toastr : ToastrService, private modalService: NgbModal) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    if (environment.live) {
      if (state.root.queryParams.err) { //collect and display error from Facebook/Google Login attempts
        this.router.navigate(['/loginSignup'], { relativeTo: this.route });
        this.toastr.error(state.root.queryParams.err)
        return false;
      }
      if (state.root.queryParams.twoFactored) {
        this.router.navigate(['/loginSignup'], { relativeTo: this.route });
        this.modalService.open(Login2FAModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
        return false;
      }
      return new Promise((resolve, reject) => {
        this.authService.getLogin()
          .then((loggedIn) => {
            if (loggedIn) {
              this.router.navigate(['/dashboard'], { relativeTo: this.route }).then(() => {this.authService.doUrlChange();});
              resolve(false);
            } else {
              resolve(true);
              this.authService.doUrlChange();
            }
          });
      });
    } else {
      return true;
    }
  }
}
