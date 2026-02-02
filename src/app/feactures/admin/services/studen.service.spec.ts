import { TestBed } from '@angular/core/testing';

import { StudenService } from './studen.service';

describe('StudenService', () => {
  let service: StudenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
