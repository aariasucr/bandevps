import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private firebaseAuth: AngularFireAuth,private router:Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const id = form.value.identificacion;
    const password = form.value.password;
    this.userService.getUserDataFromFirebase(id).then((userDataResult) => {
      // console.log(result.val());
      this.firebaseAuth
        .signInWithEmailAndPassword(userDataResult.val().email, password)
        .then((signInResult) => {
          this.userService.performLogin(signInResult, userDataResult);
          this.router.navigate(['/home']);
          // console.log('userData', userData);
        })
        .catch((error) => {
          //this.notificationService.showErrorMessage('Error iniciando sesión', error.message);
        });
      //this.statusChange.emit(userData);
    });
  }
}
