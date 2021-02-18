import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  doRegister(form: NgForm) {
    //check that the inputs are correct
    this.authService.doRegister(form.value.username, form.value.name, form.value.email, form.value.password);
  }

}
