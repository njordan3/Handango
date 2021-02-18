import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson3-practice';

@Component({
  selector: 'lesson3-practice',
  templateUrl: '../lesson3.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson3PracticeComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Practice";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
