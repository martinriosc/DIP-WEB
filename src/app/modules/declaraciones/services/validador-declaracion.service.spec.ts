import { TestBed } from '@angular/core/testing';

import { ValidadorDeclaracionService } from './validador-declaracion.service';

describe('ValidadorDeclaracionService', () => {
  let service: ValidadorDeclaracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidadorDeclaracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
