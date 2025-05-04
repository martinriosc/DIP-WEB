import { TestBed } from '@angular/core/testing';

import { DeclaracionHelperService } from './declaracion-helper.service';

describe('DeclaracionHelperService', () => {
  let service: DeclaracionHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeclaracionHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
