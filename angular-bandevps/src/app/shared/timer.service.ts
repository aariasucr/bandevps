import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subscription, BehaviorSubject} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../state/reducers';
import * as ApplicationActions from '../state/application/actions';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy {
  private $sessionIsActive: Observable<boolean>;
  private subscription: Subscription;
  private timeoutSource = new BehaviorSubject<boolean>(false);
  public timeout = this.timeoutSource.asObservable();

  constructor(private store: Store<fromRoot.State>) {
    this.$sessionIsActive = this.store.select(fromRoot.selectIsActive);
    this.subscription = this.$sessionIsActive.subscribe((value) => {
      if (!value) {
        this.timeoutSource.next(true);
      }
    });
  }

  start() {
    this.store.dispatch(new ApplicationActions.LogIn());
  }

  stop() {
    this.store.dispatch(new ApplicationActions.LogOut());
  }

  extendLogout() {
    this.store.dispatch(new ApplicationActions.ExtendLogoutTimer());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
