import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-email',
  templateUrl: './forget-email.component.html',
  styleUrls: ['./forget-email.component.css']
})
export class ForgetEmailComponent implements OnInit {

  user: User = {
    username: ''
  }

  constructor(private authService: AuthService, private toastr : ToastrService) { }

  ngOnInit(): void { }

  doForgotEmail(model: User, isValid: boolean|null) {
    if (isValid)
      this.authService.doForgotEmail(model.username);
    else
      this.toastr.error("Form data is invalid...");
  }

}

interface User {
  username: string;
}