import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonLectureComponent } from './lesson-lecture.component';

describe('LessonLectureComponent', () => {
  let component: LessonLectureComponent;
  let fixture: ComponentFixture<LessonLectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonLectureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
