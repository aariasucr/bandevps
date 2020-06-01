import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/notification.service';
import {UserData} from '../shared/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const id = form.value.identificacion;
    const password = form.value.password;
    let userDataResult: UserData;
    this.userService
      .getUserDataFromFirebaseWithId(id)
      .then((idResult: UserData) => {
        userDataResult = idResult;
        console.log('userDataResult', userDataResult);
        return this.firebaseAuth.signInWithEmailAndPassword(userDataResult.email, password);
      })
      .then((signInResult) => {
        console.log('signInResult', signInResult);
        this.userService.performLogin(signInResult, userDataResult);
        this.notificationService.showSuccessMessage('Sesión iniciada', 'Bienvenido');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('error', error);
        this.notificationService.showErrorMessage('Error al iniciar sesión', error.message);
      });
  }
}
