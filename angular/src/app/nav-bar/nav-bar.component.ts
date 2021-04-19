import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  atDashboard: boolean = false;

  constructor(private authService: AuthService, private toastr : ToastrService) { }

  ngOnInit(): void {
    let that = this;
    this.authService.urlChange.subscribe(function() {
      that.atDashboard = /dashboard/.test(window.location.href);
    });
  }

  logout() {
    let that = this;
    this.authService.logout()
      .then(function() {
        that.toastr.success("Logging out...");
      });
  }

}
