import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson2-practice';

@Component({
  selector: 'lesson2-practice',
  templateUrl: '../lesson2.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson2PracticeComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Practice";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
