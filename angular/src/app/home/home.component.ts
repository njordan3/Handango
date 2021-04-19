import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) {
    let that = this;
    this.authService.getLogin().then(function(loggedIn) {
      that.authService.doUrlChange();
    });
  }

  ngOnInit(): void {
  }
 
  toLearn(): void {

  }
}
