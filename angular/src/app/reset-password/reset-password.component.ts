import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  user: User = {
    email: ''
  }

  constructor(private authService: AuthService, private toastr : ToastrService) { }

  ngOnInit(): void { }

  doForgotPassword(model: User, isValid: boolean|null) {
    if (isValid)
      this.authService.doForgotPassword(model.email);
    else
      this.toastr.error("Form data is invalid...");
  }

}

interface User {
  email: string;
}