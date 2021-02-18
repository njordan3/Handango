import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson3LectureComponent } from './lesson3-lecture.component';

describe('Lesson3LectureComponent', () => {
  let component: Lesson3LectureComponent;
  let fixture: ComponentFixture<Lesson3LectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson3LectureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson3LectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
