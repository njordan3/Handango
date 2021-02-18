import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {launch} from './lesson3-quiz';

@Component({
  selector: 'lesson3-quiz',
  templateUrl: '../lesson3.component.html',
  styleUrls: ['../../../assets/css/lessons.css'],
  encapsulation: ViewEncapsulation.None
})
export class Lesson3QuizComponent implements OnInit {
  type: string = "";
  constructor() {
    this.type = "Quiz";
  }

  ngOnInit(): void {
    //build all the lessons after the HTML template has loaded
    launch();
  }

}
