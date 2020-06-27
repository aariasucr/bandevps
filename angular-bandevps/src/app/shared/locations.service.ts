import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private dbPath = '/locations';
  items: Observable<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.items = db.list(this.dbPath).valueChanges();
  }

  getLocationsList() {
    return this.items;
  }
}
