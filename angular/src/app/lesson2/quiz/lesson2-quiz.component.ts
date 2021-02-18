import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson2-quiz';

@Component({
  selector: 'lesson2-quiz',
  templateUrl: '../lesson2.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson2QuizComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Quiz";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
