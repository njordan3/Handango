import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson1-practice';

@Component({
  selector: 'lesson1-practice',
  templateUrl: '../lesson1.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson1PracticeComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Practice";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
