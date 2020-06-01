import {async, ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';

import {EditInformationComponent} from './edit-information.component';
import {EventEmitter} from '@angular/core';
import {UserService} from '../shared/user.service';
import {UserDataEditorComponent} from '../user-data-editor/user-data-editor.component';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {SpinnerService} from '../shared/spinner.service';
import { ToastrModule } from 'ngx-toastr';

describe('EditInformationComponent', () => {
  let component: EditInformationComponent;
  let fixture: ComponentFixture<EditInformationComponent>;

  const mockUserDataRegistrado = {
    id: '102340567'
  };

  const mockUserInformation = {
    address: 'una dirección',
    occupation: 'una ocupación',
    phoneNumber: '2222-2222'
  };

  const mockStatusChange: any = new EventEmitter<any>();

  const mockUserService: any = {
    statusChange: mockStatusChange,
    getUserInfoFromFirebaseWithId(id) {
      if (id === '102340567') {
        return Promise.resolve(mockUserInformation);
      }
    },
    updateUserInfo(userData, userInfo) {
      if (userData.id === '102340567') {
        return Promise.resolve();
      }
    }
  };

  let mockUserInfoForm: FormGroup;

  let spinnerService: SpinnerService;
  let spinnerSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
      declarations: [EditInformationComponent, UserDataEditorComponent],
      providers: [{provide: UserService, useValue: mockUserService}, SpinnerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockUserInfoForm = new FormGroup({
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });
    component.userInfoForm = mockUserInfoForm;

    spinnerService = fixture.debugElement.injector.get(SpinnerService);
    spinnerSpy = spyOn(spinnerService, 'showMainSpinner');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill form fields', fakeAsync(() => {
    expect(component.userInfoForm.get('phoneNumber').value).toBeFalsy();
    expect(component.userInfoForm.get('address').value).toBeFalsy();
    expect(component.userInfoForm.get('occupation').value).toBeFalsy();
    mockUserService.statusChange.emit(mockUserDataRegistrado);
    tick();
    expect(component.userInfoForm.get('address').value).toBe('una dirección');
    expect(component.userInfoForm.get('occupation').value).toBe('una ocupación');
    expect(component.userInfoForm.get('phoneNumber').value).toBe('2222-2222');
  }));

  it('should load and submit form', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserDataRegistrado);
    tick();
    component.onSubmit();
    tick();
    expect(spinnerSpy).toHaveBeenCalled();
    expect(spinnerSpy.calls.all().length).toEqual(2);
  }));
});
