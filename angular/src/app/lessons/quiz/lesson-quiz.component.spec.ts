import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonQuizComponent } from './lesson-quiz.component';

describe('LessonPracticeComponent', () => {
  let component: LessonQuizComponent;
  let fixture: ComponentFixture<LessonQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
