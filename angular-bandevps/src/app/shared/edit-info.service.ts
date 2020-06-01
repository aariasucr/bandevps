import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database/database';

@Injectable({
  providedIn: 'root'
})
export class EditInfoService {
  private dbPath = '/users_info';
 // items: Observable<any[]>;
  items: AngularFireList<any> = null;
  constructor(private db: AngularFireDatabase) {
    this.items = db.list(this.dbPath);
  }

  updateCustomer(key: string, value: any): Promise<void> {
    return this.items.set(key, value);
  }
 // updateCustomer(key: string, value: any): Promise<void> {
   // return this.items.update(key, value);
 // }

}
