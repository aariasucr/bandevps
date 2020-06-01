import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SegurosService {
  private dbPath = '/insurances';
  items: Observable<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.items = db.list(this.dbPath).valueChanges();
  }

  getInsuranceList() {
    return this.items;
  }
}
