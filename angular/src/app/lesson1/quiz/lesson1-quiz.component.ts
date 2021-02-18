import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson1-quiz';

@Component({
  selector: 'lesson1-quiz',
  templateUrl: '../lesson1.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson1QuizComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Quiz";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
