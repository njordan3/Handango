import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPracticeComponent } from './lesson-practice.component';

describe('LessonPracticeComponent', () => {
  let component: LessonPracticeComponent;
  let fixture: ComponentFixture<LessonPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonPracticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
