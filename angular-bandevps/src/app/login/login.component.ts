import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const id = form.value.identificacion;
    const password = form.value.password;
    let userDataResult;
    this.userService.getUserDataFromFirebase(id).then((result) => {
      userDataResult = result;
      console.log('userDataResult', userDataResult);
      return this.firebaseAuth.signInWithEmailAndPassword(userDataResult.val().email, password);
    }).then((signInResult) => {
      console.log('signInResult', signInResult);
      this.userService.performLogin(signInResult, userDataResult);
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      console.log('error', error);
    });
  }
}
