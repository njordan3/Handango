import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;

  constructor(private dashboardService: DashboardService) {
    this.FirstName = this.LastName = this.Email = this.Username = "Loading...";
  }

  ngOnInit(): void {
    let that = this;
    this.dashboardService.getUser()
      .then(function() {
        that.dashboardService.sharedFirstName?.subscribe(firstName => that.FirstName = firstName);
        that.dashboardService.sharedLastName?.subscribe(lastName => that.LastName = lastName);
        that.dashboardService.sharedUsername?.subscribe(username => that.Username = username);
        that.dashboardService.sharedEmail?.subscribe(email => that.Email = email);
      });
  }
}
