import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson3-lecture';

@Component({
  selector: 'lesson3-lecture',
  templateUrl: '../lesson3.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson3LectureComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Lecture";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
