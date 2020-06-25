import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResetPasswordRequestComponent} from './reset-password-request.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';

describe('ResetPasswordRequestComponent', () => {
  let component: ResetPasswordRequestComponent;
  let fixture: ComponentFixture<ResetPasswordRequestComponent>;

  const mockRouter: any = {navigate() {}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        ToastrModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [ResetPasswordRequestComponent],
      providers: [{provide: Router, useValue: mockRouter}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
