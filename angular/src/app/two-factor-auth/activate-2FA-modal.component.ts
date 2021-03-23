import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'activate2FAModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Two-Factor Activation</h4>
    </div>
    <form #codeForm="ngForm" novalidate (ngSubmit)="submit(codeForm.value, codeForm.valid)" autocomplete="off">
        <div class="modal-body" style="text-align: center">
            <strong>Install one of the listed apps in order to enable Two Factor verification.</strong><br>
            <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US" target="_blank">Android App</a><br>
            <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank">iPhone App</a><br>
            <a href="https://authenticator.cc/" target="_blank">Web Browser Extension</a><br>
            <strong>Scan the QR code with the authenticator app.</strong><br>
            <img src={{qrcode}}><br>
            <strong>Or input the secret manually.</strong><br>
            <small class="text-danger">We highly recommend keeping the secret written or saved somewhere as a backup.</small>
            <p>{{secret}}</p>
            <p><strong>
                Once the authenticator app is set up. It should provide you with a 6 digit code.
                Submit the code to us and we'll enable Two Factor verification for your account.
            </strong></p>
            <input type="text" placeholder="######" id="code" name="code"
            minLength="6" maxLength="6" pattern="[0-9][0-9][0-9][0-9][0-9][0-9]$" required
            [ngModel]="user.code" #code="ngModel">
        </div>
        <div class="text-center" [hidden]="code.valid || (code.pristine && !codeForm.submitted)">
            <small class="text-danger">
                Two-Factor Code is required and must hold 6 numbers.
            </small>
        </div>
        <div class="modal-footer">
            <button type="submit" [disabled]="!codeForm.valid" ngbAutofocus class="btn btn-danger">Submit</button>
        </div>
    </form>
  `,
  styleUrls: ['./login-2FA-modal.component.css']
})
export class Activate2FAModal implements OnInit {

    private _qrcode: string = "https://chart.googleapis.com/chart?cht=qr&chl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&chs=180x180&choe=UTF-8&chld=L|2";
    private _secret: string = "If you are seeing this something went wrong";

    user: User = {
        code: null
    }

    constructor(private modalService: NgbModal, private toastr: ToastrService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        let that = this;
        this.authService.doActivate2FAData()
            .then((resp) => {
                this._qrcode = resp.qrcode;
                this._secret = resp.secret;
            })
            .catch((err) => {
                that.toastr.error(err);
            })
    }

    get qrcode(): string {
        return this._qrcode;
    }

    get secret(): string {
        return this._secret;
    }

    submit(model: User, isValid: boolean|null) {
        if (isValid) {
            this.authService.doActivate2FACheck(model.code as number)
                .then((resp) => {
                    this.toastr.success(`Two Factor has successfully been added to your account!`);
                    this.modalService.dismissAll();
                })
                .catch((err) => {
                    this.toastr.error(err);
                })
        } else {
            this.toastr.error('Form data is invalid...');
        }
    }
}

interface User {
    code: number|null;
}