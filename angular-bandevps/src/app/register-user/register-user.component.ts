import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  userIdForm: FormGroup;
  userRegistrationForm: FormGroup;
  userCanRegister = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userIdForm = this.formBuilder.group({
      id: new FormControl('')
    });
    this.userRegistrationForm = this.formBuilder.group({
      password: new FormControl(''),
      passwordConf: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });
  }

  onSubmitId() {
    console.log(this.userIdForm);
    this.userCanRegister = true;
    this.userIdForm.get('id').disable();
  }

  onSubmit() {
    this.userIdForm.reset();
    this.userRegistrationForm.reset();
    this.userIdForm.get('id').enable();
  }

  resetUserIdForm() {
    this.userIdForm.reset();
    this.userIdForm.get('id').enable();
    console.log(this.userIdForm);
  }
}
