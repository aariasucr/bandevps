import {Component, OnInit, Inject} from '@angular/core';
import {UserService} from '../shared/user.service';
import {APP_TITLE} from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private isLoggedIn = false;
  private logoutString = 'Salir';

  constructor(private userService: UserService, @Inject(APP_TITLE) private title: string) {}

  ngOnInit() {
    this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
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
