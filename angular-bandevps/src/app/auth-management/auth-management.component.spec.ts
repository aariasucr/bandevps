import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthManagementComponent} from './auth-management.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Router, ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('AuthManagementComponent', () => {
  let component: AuthManagementComponent;
  let fixture: ComponentFixture<AuthManagementComponent>;

  const mockRouter: any = {navigate() {}};
  const mockActivatedRoute: any = {
    queryParams: of({param: 123})
  };

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
      declarations: [AuthManagementComponent],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
