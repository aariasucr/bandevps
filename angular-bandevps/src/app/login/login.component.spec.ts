import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {NgForm} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {APP_TITLE} from '../app.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [LoginComponent, NgForm],
      providers: [{provide: APP_TITLE, useValue: 'The Iron Bank'}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
