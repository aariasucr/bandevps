import {Component, OnInit, InjectionToken, Inject} from '@angular/core';
import {UserService} from './shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';

export const APP_TITLE = new InjectionToken<string>('AppTitle');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    @Inject(APP_TITLE) public title: string
  ) {}

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
