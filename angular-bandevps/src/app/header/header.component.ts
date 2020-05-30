import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {UserService} from '../shared/user.service';
import {APP_TITLE} from '../app.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private isLoggedIn = false;
  private logoutString = 'Salir';
  private subscription: Subscription;

  constructor(private userService: UserService, @Inject(APP_TITLE) private title: string) {}

  ngOnInit() {
    this.subscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.userService.performLogout();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getTitle() {
    return this.title;
  }

  getLogoutString() {
    return this.logoutString;
  }
}
