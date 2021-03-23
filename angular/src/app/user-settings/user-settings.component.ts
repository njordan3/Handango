import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { TwoFactorModal } from '../two-factor-auth/2FA-modal.component';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  user: User = {
    email: '',
    password: '',
    repeatPassword: '',
    newEmail: '',
    repeatEmail: ''
  };

  FirstName: string;
  LastName: string;
  AccountType: string|null = null;

  Live = environment.live;

  just2FAd: boolean = false;

  constructor(private router: Router, private authService: AuthService, private modalService: NgbModal, private toastr : ToastrService, private dashboardService: DashboardService) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      var data = this.router.getCurrentNavigation()?.extras.state;
      if (data?.err) {
        this.toastr.error(data.err);
      } else if (data?.message) {
        this.authService.logout()
          .then(() => {
            this.toastr.success(data?.message);
          });
      } else {
        if (data?.resp === "isNotLoggedIn") {
          window.location.href = environment.domainUrl+'/home';
        } else if (data?.resp === "isNotJust2FAd") {
          this.modalService.open(TwoFactorModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
          this.modalService.activeInstances.subscribe((closed) => {
            this.just2FAd = true;
            if (data?.function === "changeToGoogle") {
              this.doChangeToGoogle();
            } else if (data?.function === "changeToFacebook") {
              this.doChangeToFacebook();
            }
          });
        } else if (data?.resp === "isGoogle") {
          this.toastr.error("A Google account cannot be changed to Google");
        } else if (data?.resp === "isFacebook") {
          this.toastr.error("A Facebook account cannot be changed to Facebook");
        }
      }
    }

    this.FirstName = this.LastName = "Loading...";
  }

  ngOnInit(): void {
    let that = this;
    this.dashboardService.getUser()
      .then(function() {
        that.dashboardService.sharedFirstName?.subscribe(firstName => that.FirstName = firstName);
        that.dashboardService.sharedLastName?.subscribe(lastName => that.LastName = lastName);
        that.dashboardService.sharedAccountType?.subscribe(accountType => that.AccountType = accountType);
      });
  }

  doChangeEmail(model: User, isValid: boolean|null): void {
    if (environment.live) {
      if (isValid) {
        this.authService.doChangeEmail(model, this.just2FAd)
          .then((resp) => {
            if (resp.loggedIn) {
              if (resp.twoFactor && !this.just2FAd) {
                this.modalService.open(TwoFactorModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
                this.modalService.activeInstances.subscribe((closed) => {
                  this.just2FAd = true;
                  this.doChangeEmail(model, isValid);
                });
              } else {
                this.authService.logout()
                  .then(() => {
                    this.toastr.success(resp.message);
                    this.just2FAd = false;
                  });
              }
            } else {
              window.location.href = `https://duohando.com/home`;
              this.toastr.error(resp.message);
            }
          })
          .catch((err) => {
            this.toastr.error(err);
          });
      } else {
        this.toastr.error("Form data is invalid...");
      }
    } else {
      this.toastr.success("Email changed!");
    }
  }

  doChangeToFacebook(): void {
    if (environment.live) {
      this.authService.doChangeToFacebook(this.just2FAd);
    } else {
      this.toastr.success("Account changed to Facebook!");
    }
  }

  doChangeToGoogle(): void {
    if (environment.live) {
      this.authService.doChangeToGoogle(this.just2FAd);
    } else {
      this.toastr.success("Account changed to Google!");
    }
  }

  doChangeToEmail(model: User, isValid: boolean|null): void {
    if (environment.live) {
      if (isValid) {
        this.authService.doChangeToEmail(model, isValid)
          .then((resp) => {
            this.toastr.success(resp);
          })
          .catch((err) => {
            this.toastr.error(err);
          });
      } else {
        this.toastr.error("Form data is invalid...");
      }
    } else {
      this.toastr.success("Account changed to email!");
    }
  }
}

interface User {
  email: string;
  password: string;
  repeatPassword: string;
  newEmail: string;
  repeatEmail: string;
}
