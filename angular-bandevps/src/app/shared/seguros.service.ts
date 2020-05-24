import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {
  private dbPath = '/users';
  private data;
  constructor(private db: AngularFireDatabase) {
    this.data=db.list(this.dbPath)

   }

  getCustomersList() {
    console.log(this.data)
  }
}
