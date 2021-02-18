import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson2LectureComponent } from './lesson2-lecture.component';

describe('Lesson2LectureComponent', () => {
  let component: Lesson2LectureComponent;
  let fixture: ComponentFixture<Lesson2LectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson2LectureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson2LectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
