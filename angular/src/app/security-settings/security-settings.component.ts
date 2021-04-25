import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Activate2FAModal } from '../two-factor-auth/activate-2FA-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { TwoFactorModal } from '../two-factor-auth/2FA-modal.component';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent implements OnInit {

  user: User = {
    password: '',
    newPassword: '',
    repeatPassword: ''
  };

  FirstName: string;
  LastName: string;
  AccountType: string|null = null;
  TwoFactored: boolean = false;

  Live = environment.live;

  just2FAd: boolean = false;

  constructor(private authService: AuthService, private modalService: NgbModal, private toastr : ToastrService, private dashboardService: DashboardService) {
    this.FirstName = this.LastName = "Loading...";
  }

  ngOnInit(): void {
    let that = this;
    this.dashboardService.getUser()
      .then(function() {
        that.dashboardService.sharedFirstName?.subscribe(firstName => that.FirstName = firstName);
        that.dashboardService.sharedLastName?.subscribe(lastName => that.LastName = lastName);
        that.dashboardService.sharedAccountType?.subscribe(accountType => that.AccountType = accountType);
        that.dashboardService.sharedTwoFactored?.subscribe(twoFactored => that.TwoFactored = twoFactored);
      });
  }

  enable2FA(): void {
    this.modalService.open(Activate2FAModal, { centered: true, animation: true, keyboard: false, backdrop: 'static', size: "lg" });
      this.modalService.activeInstances.subscribe((closed) => {
        this.authService.logout()
          .then(() => {
            this.toastr.success(`Two Factor has successfully been added to your account! You are being logged out...`);
          });
    })
  }

  doChangePassword(model: User, isValid: boolean|null) {
    if (environment.live) {
      if (isValid) {
        this.authService.doChangePassword(model, this.just2FAd)
          .then((resp) => {
            if (resp.loggedIn) {
              if (resp.twoFactor && !this.just2FAd) {
                this.modalService.open(TwoFactorModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
                this.modalService.activeInstances.subscribe((closed) => {
                  this.just2FAd = true;
                  this.doChangePassword(model, isValid);
                })
              } else {
                this.authService.logout()
                  .then(() => {
                    this.toastr.success(resp.message);
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
      this.toastr.success("Password changed!");
    }
  }
}

interface User {
  password: string;
  newPassword: string;
  repeatPassword: string;
}