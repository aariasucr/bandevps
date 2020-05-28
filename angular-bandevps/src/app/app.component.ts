import {Component, OnInit, InjectionToken, Inject, OnDestroy} from '@angular/core';
import {UserService} from './shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {TimerService} from './shared/timer.service';
import {Subscription} from 'rxjs';

export const APP_TITLE = new InjectionToken<string>('AppTitle');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private timerService: TimerService,
    @Inject(APP_TITLE) public title: string
  ) {}

  ngOnInit(): void {
    // Se revisa en Firebase si el usuario cambio su estado de autenticación
    // (i.e., pasó de logged out a logged in o a la inversa)
    this.firebaseAuth.onAuthStateChanged((user) => {
      console.log('user en init de AppComponent', user);
      if (user) {
        this.userService.performLoginUid(user.uid);
        this.timerService.start();
      } else {
        this.userService.performLogout();
      }
    });

    this.subscription = this.timerService.timeout.subscribe(() => {
      alert('La sesión ha expirado');
      this.userService.performLogout();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
