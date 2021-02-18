import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson3PracticeComponent } from './lesson3-practice.component';

describe('Lesson3PracticeComponent', () => {
  let component: Lesson3PracticeComponent;
  let fixture: ComponentFixture<Lesson3PracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson3PracticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson3PracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
