import {Component, OnInit} from '@angular/core';
import {UserService} from './shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-bandevps';

  constructor(private userService: UserService, private firebaseAuth: AngularFireAuth) {}

  ngOnInit(): void {
    // Se revisa en Firebase si el usuario cambio su estado de autenticación
    // (i.e., pasó de logged out a logged in o a la inversa)
    this.firebaseAuth.onAuthStateChanged((user) => {
      console.log('user en init de AppComponent', user);
      if (user) {
        this.userService.performLoginUid(user.uid);
      } else {
        this.userService.performLogout();
      }
    });
  }
}
