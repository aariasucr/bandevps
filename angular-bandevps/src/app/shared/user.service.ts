import {Injectable, EventEmitter} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';

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

  isUserLoggedIn() {
    return this.isLoggedIn;
  }
}
