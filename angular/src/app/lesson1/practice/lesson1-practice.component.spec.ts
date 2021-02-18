import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson1PracticeComponent } from './lesson1-practice.component';

describe('Lesson1PracticeComponent', () => {
  let component: Lesson1PracticeComponent;
  let fixture: ComponentFixture<Lesson1PracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson1PracticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson1PracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
