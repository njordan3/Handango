import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Lessons: Array<any> = [];
  Live = environment.live;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    let that = this;
    this.dashboardService.getUser()
      .then(function() {
        that.dashboardService.sharedLessons?.subscribe(Lessons => that.Lessons = Lessons);
        for (let lesson of that.Lessons) {
          let date = (lesson.unlock_date as string).slice(0, 10);
          date = `${date.split('-')[1]}-${date.split('-')[2]}-${date.split('-')[0]}`;
          lesson.unlock_date = date;
        }
      });
  }

}
