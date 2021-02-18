import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = {
    username: '',
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  };

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void { }

  doRegister(model: User, isValid: boolean|null) {
    //form data gets validated automatically by predefined directives in the included templateUrl
    //and password and repeated password validation code can be seen in 'equal-validator.directive.ts'
    if (isValid) {
      let name = model.name.split(" ");
      this.authService.doRegister(model.username, name[0], name[1], model.email, model.password);
    } else {
      this.toastr.error('Form data is invalid...');
    }
  }

  doFacebook() {
    console.log("Facebook");
    this.authService.doFacebook();
  }

  doGoogle() {
    console.log("Google");
    this.authService.doGoogle();
  }

}

interface User {
  username: string;
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}
