import {async, ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';

import {ResetPasswordRequestComponent} from './reset-password-request.component';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {UserService} from '../shared/user.service';
import {SpinnerService} from '../shared/spinner.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotificationService} from '../shared/notification.service';

describe('ResetPasswordRequestComponent', () => {
  let component: ResetPasswordRequestComponent;
  let fixture: ComponentFixture<ResetPasswordRequestComponent>;

  const mockRouter: any = {navigate() {}};
  const mockUserDataNoRegistrado = {
    registered: false,
    id: '999999999'
  };

  const mockUserDataRegistrado = {
    registered: true,
    id: '102340567',
    email: 'test@test.com'
  };

  const mockAngularFireAuth: any = {
    sendPasswordResetEmail() {
      return Promise.resolve(true);
    }
  };
  const mockUserService: any = {
    getUserDataFromFirebaseWithId(id) {
      if (id === '1') {
        return Promise.reject('INVALID_ID');
      } else if (id === '102340567') {
        return Promise.resolve(mockUserDataRegistrado);
      } else if (id === '999999999') {
        return Promise.resolve(mockUserDataNoRegistrado);
      }
    }
  };

  let mockUserIdForm: FormGroup;
  let auth: AngularFireAuth;
  let notification: NotificationService;
  let resetPasswordSpy: jasmine.Spy;
  let errorMessageSpy: jasmine.Spy;

  const userPasswordReset = () => {
    component.userIdForm = mockUserIdForm;
    component.onSubmit();
    tick();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgxSpinnerModule,
        ToastrModule.forRoot(),
        ModalModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [ResetPasswordRequestComponent],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: UserService, useValue: mockUserService},
        {provide: AngularFireAuth, useValue: mockAngularFireAuth},
        SpinnerService,
        NotificationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    auth = fixture.debugElement.injector.get(AngularFireAuth);
    resetPasswordSpy = spyOn(auth, 'sendPasswordResetEmail');
    notification = fixture.debugElement.injector.get(NotificationService);
    errorMessageSpy = spyOn(notification, 'showErrorMessage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not reset password for invalid user id', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('1')
    });
    userPasswordReset();
    tick(10000);
    expect(resetPasswordSpy).not.toHaveBeenCalled();
    expect(errorMessageSpy).toHaveBeenCalled();
  }));

  it('should not reset password for unregistered user', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('999999999')
    });
    userPasswordReset();
    tick(10000);
    expect(resetPasswordSpy).not.toHaveBeenCalled();
    expect(errorMessageSpy).toHaveBeenCalled();
  }));

  it('should reset password for registered user', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('102340567')
    });
    userPasswordReset();
    tick(10000);
    expect(resetPasswordSpy).toHaveBeenCalled();
  }));
});
