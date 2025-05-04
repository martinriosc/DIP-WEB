import { TestBed } from '@angular/core/testing';

import { StepperStatusService } from './stepper-status.service';

describe('StepperStatusService', () => {
  let service: StepperStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepperStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
