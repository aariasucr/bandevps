import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserDataEditorComponent} from './user-data-editor.component';
import {ReactiveFormsModule, FormsModule, FormControl, FormGroup} from '@angular/forms';

describe('UserDataEditorComponent', () => {
  let component: UserDataEditorComponent;
  let fixture: ComponentFixture<UserDataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [UserDataEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataEditorComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
