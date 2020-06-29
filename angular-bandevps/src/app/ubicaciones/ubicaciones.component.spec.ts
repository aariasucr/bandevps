import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UbicacionesComponent} from './ubicaciones.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {LocationsService} from '../shared/locations.service';
import {GoogleMapsModule} from '@angular/google-maps';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

describe('UbicacionesComponent', () => {
  let component: UbicacionesComponent;
  let fixture: ComponentFixture<UbicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbicacionesComponent],
      imports: [
        GoogleMapsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        ModalModule.forRoot()
      ],
      providers: [LocationsService, BsModalService,
        BsModalRef,]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
