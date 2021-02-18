import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson1-lecture';

@Component({
  selector: 'lesson1-lecture',
  templateUrl: '../lesson1.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson1LectureComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Lecture";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
