import {Injectable, EventEmitter} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {UserData, UserInformation} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public statusChange: any = new EventEmitter<any>();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase
  ) {}

  performLogin(signInResult, userData) {
    this.statusChange.emit(userData);
    console.log('userDataResult en performLogin', userData);
    console.log('signInResult en performLogin', signInResult);
  }

  performLoginEmail(email: string) {
    this.getUserDataFromFirebaseWithEmail(email)
      .then((userData: UserData) => {
        console.log('result.val() en performLoginUid', userData);
        this.statusChange.emit(userData);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  performLogout() {
    this.firebaseAuth.signOut().then(() => {
      this.statusChange.emit(null);
    });
  }

  getUserDataFromFirebaseWithEmail(email: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref('users')
        .orderByChild('email')
        .equalTo(email)
        .limitToFirst(1)
        .once('value')
        .then((dataSnapshot: DataSnapshot) => {
          if (dataSnapshot.exists()) {
            const jsonDataSnapshot = dataSnapshot.toJSON();
            const id = Object.keys(dataSnapshot.exportVal())[0];
            const userData: UserData = {
              created: jsonDataSnapshot[id].created,
              creationDate: jsonDataSnapshot[id].creationDate,
              registered: jsonDataSnapshot[id].registered,
              email: jsonDataSnapshot[id].email,
              fullName: jsonDataSnapshot[id].fullName,
              id
            };
            resolve(userData);
          } else {
            reject('invalid/email');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUserDataFromFirebaseWithId(id: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref('users')
        .child(id)
        .once('value')
        .then((result) => {
          if (!!result && !!result.val() && 'email' in result.val()) {
            const userData: UserData = {
              created: result.val().created,
              creationDate: result.val().creationDate,
              registered: result.val().registered,
              email: result.val().email,
              fullName: result.val().fullName,
              id
            };
            resolve(userData);
          } else {
            reject('invalid/id');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  insertUserInfoAndSetUserRegistered(userData: UserData, userInfo: UserInformation) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`users_info/${userData.id}`)
        .set(userInfo)
        .then(() => {
          return this.firebaseDatabase.database.ref(`users/${userData.id}`).update({
            registered: true
          });
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  invalidateUser(userData: UserData) {
    this.firebaseDatabase.database.ref(`users/${userData.id}`).update({
      registered: false
    });
  }
}
