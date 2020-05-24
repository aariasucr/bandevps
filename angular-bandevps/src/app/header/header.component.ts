import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private isLoggedIn = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.statusChange.subscribe(userData => {
      
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
}
