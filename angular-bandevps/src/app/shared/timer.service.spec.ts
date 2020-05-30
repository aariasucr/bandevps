import {TestBed} from '@angular/core/testing';

import {TimerService} from './timer.service';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../state/reducers';

describe('TimerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)]
    })
  );

  it('should be created', () => {
    const service: TimerService = TestBed.get(TimerService);
    expect(service).toBeTruthy();
  });
});
