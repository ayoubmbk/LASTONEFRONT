import { TestBed } from '@angular/core/testing';

import { PhaseServiceService } from './phase-service.service';

describe('PhaseServiceService', () => {
  let service: PhaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
