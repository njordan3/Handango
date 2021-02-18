import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson1QuizComponent } from './lesson1-quiz.component';

describe('Lesson1PracticeComponent', () => {
  let component: Lesson1QuizComponent;
  let fixture: ComponentFixture<Lesson1QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson1QuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson1QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
