import {TestBed} from '@angular/core/testing';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {SegurosService} from './seguros.service';

describe('SegurosService', () => {
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
    const service: SegurosService = TestBed.get(SegurosService);
    expect(service).toBeTruthy();
  });
});
