import {Injectable, OnDestroy, EventEmitter} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../state/reducers';
import * as ApplicationActions from '../state/application/actions';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy {
  private $sessionIsActive: Observable<boolean>;
  private subscription: Subscription;
  public timeout: any = new EventEmitter<any>();

  constructor(private store: Store<fromRoot.State>) {
    this.$sessionIsActive = this.store.select(fromRoot.selectIsActive);
    this.subscription = this.$sessionIsActive.subscribe((value) => {
      if (!value) {
        this.timeout.emit(null);
      }
    });
  }

  start() {
    this.store.dispatch(new ApplicationActions.LogIn());
  }

  extendLogout(){
    this.store.dispatch(new ApplicationActions.ExtendLogoutTimer());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
