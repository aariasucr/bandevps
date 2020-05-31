import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database/database';

@Injectable({
  providedIn: 'root'
})
export class EditInfoService {
  private dbPath = '/insurances';
  items: Observable<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.items = db.list(this.dbPath).valueChanges();
  }

 // updateCustomer(key: string, value: any): Promise<void> {
   // return this.items.update(key, value);
 // }

}
