import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {SyncAsync} from '@angular/compiler/src/util';
@Injectable({
  providedIn: 'root'
})
export class SegurosService {
  private dbPath = '/users';

  items: Observable<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.items = db.list('users/x3jg7iHumZSbVZERIBWhaWPzxnt2').valueChanges();
  }

  getCustomersList() {
    return this.items;
  }
}
