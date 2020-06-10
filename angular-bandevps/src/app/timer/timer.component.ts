import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../shared/user.service';
import {TimerService} from '../shared/timer.service';
import {Subscription} from 'rxjs';
import {NotificationService} from '../shared/notification.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  private isLoggedIn = false;
  private timerSubscription: Subscription = null;
  private userSubscription: Subscription = null;

  constructor(
    private userService: UserService,
    private timerService: TimerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.isLoggedIn = true;
        this.timerService.start();
      } else {
        this.isLoggedIn = false;
        this.timerService.stop();
      }
    });

    this.timerSubscription = this.timerService.timeout.subscribe(() => {
      // Solo es necesario responder al evento de que expiró la sesión si el usuario está logueado
      if (this.isLoggedIn) {
        this.notificationService.showAlert('La sesión ha expirado', 'Debe volver a iniciar la sesión para continuar.');
        this.userService.performLogout();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
