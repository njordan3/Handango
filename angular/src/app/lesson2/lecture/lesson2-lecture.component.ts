import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson2-lecture';

@Component({
  selector: 'lesson2-lecture',
  templateUrl: '../lesson2.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson2LectureComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Lecture";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
