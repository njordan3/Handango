import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson1LectureComponent } from './lesson1-lecture.component';

describe('Lesson1LectureComponent', () => {
  let component: Lesson1LectureComponent;
  let fixture: ComponentFixture<Lesson1LectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson1LectureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson1LectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
