import {TestBed} from '@angular/core/testing';

import {LocationsService} from './locations.service';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';

describe('LocationsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
      ]
    })
  );

  it('should be created', () => {
    const service: LocationsService = TestBed.get(LocationsService);
    expect(service).toBeTruthy();
  });
});
