import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson2PracticeComponent } from './lesson2-practice.component';

describe('Lesson2PracticeComponent', () => {
  let component: Lesson2PracticeComponent;
  let fixture: ComponentFixture<Lesson2PracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lesson2PracticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lesson2PracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
