import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {timer} from 'rxjs';
import * as ApplicationActions from './actions';

@Injectable()
export class ApplicationEffects {
  APPLICATION_TIMEOUT_TIME = 1000 * 600;

  constructor(private actions$: Actions) {}

  @Effect()
  extendApplicationTimeout$ = this.actions$.pipe(
    switchMap(() => {
      return timer(this.APPLICATION_TIMEOUT_TIME);
    }),
    map(() => {
      return new ApplicationActions.LogOut();
    })
  );
}
