import {Injectable, EventEmitter} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {UserData} from './models';
import {combineLatest} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn = false;
  public statusChange: any = new EventEmitter<any>();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase
  ) {}

  performLogin(signInResult, userDataResult) {
    this.isLoggedIn = true;
    console.log(signInResult);
    const userData: UserData = userDataResult.val();
    this.statusChange.emit(userData);
    //console.log(userData)
  }

  getUserDataFromFirebase(uid: string) {
    return this.firebaseDatabase.database.ref('users').child(uid).once('value');
  }
  isUserLoggedIn() {
    return this.isLoggedIn;
  }
}
