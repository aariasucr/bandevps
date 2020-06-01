import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {UserData, UserInformation} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // public statusChange: any = new EventEmitter<any>();
  private userSource = new BehaviorSubject<UserData>(null);
  public statusChange = this.userSource.asObservable();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase
  ) {}

  performLogin(signInResult, userData) {
    // this.statusChange.emit(userData);
    this.userSource.next(userData);
    console.log('userDataResult en performLogin', userData);
    console.log('signInResult en performLogin', signInResult);
  }

  performLoginEmail(email: string) {
    this.getUserDataFromFirebaseWithEmail(email)
      .then((userData: UserData) => {
        console.log('result.val() en performLoginUid', userData);
        // this.statusChange.emit(userData);
        this.userSource.next(userData);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  performLogout() {
    this.firebaseAuth.signOut().then(() => {
      // this.statusChange.emit(null);
      this.userSource.next(null);
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
            reject('INVALID_EMAIL');
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
            reject('INVALID_ID');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  insertUserInfoAndSetUserRegistered(id: string, userInfo: UserInformation) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`users_info/${id}`)
        .set(userInfo)
        .then(() => {
          return this.firebaseDatabase.database.ref(`users/${id}`).update({
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

  invalidateUser(id: string) {
    this.firebaseDatabase.database.ref(`users/${id}`).update({
      registered: false
    });
  }

  updateUserInfo(id: string, userInfo: UserInformation) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`users_info/${id}`)
        .set(userInfo)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getUserInfoFromFirebaseWithId(id: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref('users_info')
        .child(id)
        .once('value')
        .then((result) => {
          if (!!result && !!result.val()) {
            const userInfo: UserInformation = result.val();
            resolve(userInfo);
          } else {
            reject('INVALID_ID');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
