import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson3QuizComponent } from './lesson3-quiz.component';

describe('Lesson3PracticeComponent', () => {
  let component: Lesson3QuizComponent;
  let fixture: ComponentFixture<Lesson3QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson3QuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson3QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
