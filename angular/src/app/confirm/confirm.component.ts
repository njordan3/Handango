import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  private _secret: string = "";
  private _type: string = "";
  message: string | null = null;
  error: string | null = null;

  user: User = {
    password: '',
    repeatPassword: ''
  };

  constructor(private router: Router, private authService: AuthService, private toastr : ToastrService) { 
    if (this.router.getCurrentNavigation()?.extras.state) {
      var data: any = this.router.getCurrentNavigation()?.extras.state;
      if (data.message) {
        this.message = data.message;
      } else if (data.error) {
        this.error = data.error;
      } else {
        this._type = Object.keys(data)[0];
        this._secret = data[this._type];
      }
    } else {
      this.error = "Uknown";
    }
  }

  ngOnInit(): void { }

  doConfirm(model: User, isValid: boolean|null) {
    if (isValid)
      this.authService.doConfirm(model as any, this._type, this._secret)
        .then((resp) => {
          if (resp.error) {
            this.toastr.error(resp.error);
          } else {
            this.toastr.success(resp.message);
          }
        });
    else
      this.toastr.error("Form data is invalid...");
  }

  get secret(): string {
    return this._secret;
  }

  get type(): string {
    return this._type;
  }

}

interface User {
  password: string;
  repeatPassword: string;
}