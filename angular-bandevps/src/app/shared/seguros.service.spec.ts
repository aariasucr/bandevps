import { TestBed } from '@angular/core/testing';

import { SegurosService } from './seguros.service';

describe('SegurosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SegurosService = TestBed.get(SegurosService);
    expect(service).toBeTruthy();
  });
});
