import { TestBed } from '@angular/core/testing';

import { LessonGuard } from './lesson.guard';

describe('LessonGuard', () => {
  let guard: LessonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LessonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
