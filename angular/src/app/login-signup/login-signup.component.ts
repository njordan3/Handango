import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Login2FAModal } from '../two-factor-auth/login-2FA-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {

  loggedIn: boolean = false;

  user: User = {
    email: "",
    password: ""
  }

  constructor(private authService: AuthService, private toastr: ToastrService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void { }

  doLogin(model: User, isValid: boolean|null) {
    if (isValid) {
      if (environment.live) {
        this.authService.doLogin(model.email, model.password)
        .then((resp) => {
          console.log(resp);
          if (resp.twoFactor) {
            this.modalService.open(Login2FAModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });            
          } else {
            this.toastr.success(`Welcome ${resp.fname}!`);
            this.router.navigate(['/dashboard'], { relativeTo: this.route });
          }
        })
        .catch((err) => {
          this.toastr.error(err);
        });
      } else {
        this.router.navigate(['/dashboard'], { relativeTo: this.route });
      }
    } else {
      this.toastr.error('Form data is invalid...');
    }
  }

  doLogout() {
    this.authService.logout();
  }

  doFacebook() {
    if (environment.live) {
      this.authService.doFacebook();
    } else {
      this.router.navigate(['/dashboard'], { relativeTo: this.route });
    }
  }

  doGoogle() {
    if (environment.live) {
      this.authService.doGoogle();
    } else {
      this.router.navigate(['/dashboard'], { relativeTo: this.route });
    }
  }
}

interface User {
  email: string;
  password: string;
}