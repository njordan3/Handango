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
  CreateTime: string;
  LastLogin: string;
  AccountType: string|null;

  constructor(private dashboardService: DashboardService) {
    this.FirstName = this.LastName = this.Email = this.Username = this.CreateTime = this.LastLogin = this.AccountType = "Loading...";
  }

  ngOnInit(): void {
    let that = this;
    this.dashboardService.getUser()
      .then(function() {
        that.dashboardService.sharedFirstName?.subscribe(firstName => that.FirstName = firstName);
        that.dashboardService.sharedLastName?.subscribe(lastName => that.LastName = lastName);
        that.dashboardService.sharedUsername?.subscribe(username => that.Username = username);
        that.dashboardService.sharedEmail?.subscribe(email => that.Email = email);
        
        that.dashboardService.sharedCreateTime?.subscribe(createTime => that.CreateTime = createTime);
        let date = that.CreateTime.split(' ')[0];
        let time = that.CreateTime.split(' ')[1];
        let pm: boolean;
        pm = parseInt(time.split(':')[0]) > 11;
        date = `${date.split('-')[1]}-${date.split('-')[2]}-${date.split('-')[0]} at ${parseInt(time.split(':')[0]) == 12 ? 12 : parseInt(time.split(':')[0])%12}:${time.split(':')[1]}${pm ? 'pm' : 'am'}`;
        that.CreateTime = date;

        that.dashboardService.sharedLastLogin?.subscribe(lastLogin => that.LastLogin = lastLogin);
        if (that.LastLogin === null) {
          that.LastLogin = "Never";
        } else {
          date = that.LastLogin.split(' ')[0];
          time = that.LastLogin.split(' ')[1];
          pm = parseInt(time.split(':')[0]) > 11;
          date = `${date.split('-')[1]}-${date.split('-')[2]}-${date.split('-')[0]} at ${parseInt(time.split(':')[0]) == 12 ? 12 : parseInt(time.split(':')[0])%12}:${time.split(':')[1]}${pm ? 'pm' : 'am'}`;
          that.LastLogin = date;
        }

        that.dashboardService.sharedAccountType?.subscribe(accountType => that.AccountType = accountType);
      });
  }
}
