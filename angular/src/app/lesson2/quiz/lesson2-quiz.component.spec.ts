import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson2QuizComponent } from './lesson2-quiz.component';

describe('Lesson2PracticeComponent', () => {
  let component: Lesson2QuizComponent;
  let fixture: ComponentFixture<Lesson2QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson2QuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson2QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
