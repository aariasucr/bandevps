import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterUserComponent} from './register-user.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {UserPasswordEditorComponent} from '../user-password-editor/user-password-editor.component';
import {UserDataEditorComponent} from '../user-data-editor/user-data-editor.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SpinnerService} from '../shared/spinner.service';
import {UserService} from '../shared/user.service';

describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;

  const mockUserService: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, NgxSpinnerModule],
      declarations: [UserPasswordEditorComponent, UserDataEditorComponent, RegisterUserComponent],
      providers: [SpinnerService, {provide: UserService, useValue: mockUserService}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
