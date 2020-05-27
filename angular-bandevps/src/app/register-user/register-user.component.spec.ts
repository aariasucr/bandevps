import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterUserComponent} from './register-user.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {UserPasswordEditorComponent} from '../user-password-editor/user-password-editor.component';
import {UserDataEditorComponent} from '../user-data-editor/user-data-editor.component';

describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [UserPasswordEditorComponent, UserDataEditorComponent, RegisterUserComponent]
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
