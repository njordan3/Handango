import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'login2FAModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Two-Factor Login</h4>
    </div>
    <form #codeForm="ngForm" novalidate (ngSubmit)="submit(codeForm.value, codeForm.valid)" autocomplete="off">
        <div class="modal-body" style="text-align: center">
            <p><strong>Open up your authenticator app and input your 6-digit code.</strong></p>
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
export class Login2FAModal {

    user: User = {
        code: null
    }

    constructor(private modalService: NgbModal, private toastr: ToastrService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    submit(model: User, isValid: boolean|null) {
        if (isValid) {
            this.authService.doLogin2FACheck(model.code as number)
                .then((resp) => {
                    this.modalService.dismissAll();
                    this.router.navigate(['/dashboard'], { relativeTo: this.route }).then(() => {this.authService.doUrlChange();});
                    this.toastr.success(`Welcome ${resp.fname}!`);
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