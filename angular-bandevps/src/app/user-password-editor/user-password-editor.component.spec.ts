import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPasswordEditorComponent} from './user-password-editor.component';
import {ReactiveFormsModule, FormControl, FormsModule, FormGroup} from '@angular/forms';

describe('UserPasswordEditorComponent', () => {
  let component: UserPasswordEditorComponent;
  let fixture: ComponentFixture<UserPasswordEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [UserPasswordEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordEditorComponent);
    component = fixture.componentInstance;
    // pass in the form dynamically
    component.form = new FormGroup({
      password: new FormControl(''),
      passwordConf: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
