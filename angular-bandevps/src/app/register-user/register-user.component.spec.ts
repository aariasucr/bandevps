import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {RegisterUserComponent} from './register-user.component';
import {ReactiveFormsModule, FormsModule, FormGroup, FormControl} from '@angular/forms';
import {UserPasswordEditorComponent} from '../user-password-editor/user-password-editor.component';
import {UserDataEditorComponent} from '../user-data-editor/user-data-editor.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SpinnerService} from '../shared/spinner.service';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {ToastrModule} from 'ngx-toastr';

describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;

  const mockUserDataNoRegistrado = {
    created: 0,
    creationDate: 'date',
    registered: false,
    email: 'test@test.com',
    fullName: 'Nombre Apellido Apellido',
    id: '999999999'
  };

  const mockUserDataRegistrado = {
    registered: true,
    id: '102340567'
  };

  const mockAngularFireAuth: any = {};
  const mockUserService: any = {
    getUserDataFromFirebaseWithId(id) {
      console.log(id);
      if (id === '1') {
        return Promise.reject('INVALID_ID');
      } else if (id === '102340567') {
        return Promise.resolve(mockUserDataRegistrado);
      } else {
        return Promise.resolve(mockUserDataNoRegistrado);
      }
    }
  };

  // Spies para SpinnerService
  let spinnerService: SpinnerService;
  let spinnerSpy: jasmine.Spy;

  // Mocks de forms
  let mockUserIdForm: FormGroup;

  const userRegistrationFormHidden = (mockUserIdFormForCase) => {
    component.userIdForm = mockUserIdFormForCase;
    component.onSubmitUserIdForm();
    tick();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const hidden = compiled.querySelector('[hidden]');
    expect(hidden.textContent).toContain('Contraseña');
    expect(hidden.textContent).toContain('Teléfono');
    expect(hidden.textContent).toContain('Ocupación');
    expect(hidden.textContent).toContain('Dirección');
    expect(hidden.textContent).toContain('Registrar');
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgxSpinnerModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [UserPasswordEditorComponent, UserDataEditorComponent, RegisterUserComponent],
      providers: [
        SpinnerService,
        {provide: UserService, useValue: mockUserService},
        {provide: AngularFireAuth, useValue: mockAngularFireAuth}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spinnerService = fixture.debugElement.injector.get(SpinnerService);
    spinnerSpy = spyOn(spinnerService, 'showMainSpinner');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not hide user id form field', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const hidden = compiled.querySelector('[hidden]');
    expect(hidden.textContent).not.toContain('Identificación');
    expect(hidden.textContent).not.toContain('Buscar');
  });

  it('should keep user registration form hidden when id is invalid', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('1')
    });
    userRegistrationFormHidden(mockUserIdForm);
  }));

  it('should keep user registration form hidden for registered user', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('102340567')
    });
    userRegistrationFormHidden(mockUserIdForm);
  }));

  it('should not hide user registration form hidden when id is valid', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('999999999')
    });
    component.userIdForm = mockUserIdForm;
    component.onSubmitUserIdForm();
    tick();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const hidden = compiled.querySelector('[hidden]');
    expect(hidden).toBeFalsy();
  }));

  it('name and email fields should be disabled for registration step', fakeAsync(() => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('999999999')
    });
    component.userIdForm = mockUserIdForm;
    component.onSubmitUserIdForm();
    tick();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const disabledName = compiled.querySelector('input[name="name"][disabled=""]');
    const disabledEmail = compiled.querySelector('input[name="email"][disabled=""]');
    const disabledPhoneNumber = compiled.querySelector('input[name="phoneNumber"][disabled=""]');
    const disabledOccupation = compiled.querySelector('input[name="occupation"][disabled=""]');
    expect(disabledName).toBeTruthy();
    expect(disabledEmail).toBeTruthy();
    expect(disabledPhoneNumber).toBeFalsy();
    expect(disabledOccupation).toBeFalsy();
  }));

  it('should submit user id form', () => {
    mockUserIdForm = new FormGroup({
      id: new FormControl('1')
    });
    component.userIdForm = mockUserIdForm;
    component.onSubmitUserIdForm();

    expect(spinnerSpy).toHaveBeenCalled();
    expect(spinnerSpy.calls.all().length).toEqual(1);
  });
});
