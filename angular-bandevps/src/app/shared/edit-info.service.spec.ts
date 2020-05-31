import { TestBed } from '@angular/core/testing';

import { EditInfoService } from './edit-info.service';

describe('EditInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditInfoService = TestBed.get(EditInfoService);
    expect(service).toBeTruthy();
  });
});
