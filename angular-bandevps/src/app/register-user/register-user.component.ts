import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements AfterViewInit, OnInit {
  userIdForm: FormGroup;
  userRegistrationForm: FormGroup;
  userCanRegister = false;

  constructor() {}

  ngOnInit() {
    this.userIdForm = new FormGroup({
      id: new FormControl('')
    });
    this.userRegistrationForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      passwordConf: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });
  }

  ngAfterViewInit(): void {}

  onSubmitUserIdForm() {
    console.log('userIdForm', this.userIdForm);
    this.userCanRegister = true;
    this.userIdForm.get('id').disable();
    this.userRegistrationForm.get('name').patchValue('Nombre traído de DB');
    this.userRegistrationForm.get('name').disable();
    this.userRegistrationForm.get('email').patchValue('Email traído de DB, con * para ocultar chars');
    this.userRegistrationForm.get('email').disable();
    console.log('userRegistrationForm', this.userRegistrationForm);
  }

  onSubmitUserRegistrationForm() {
    console.log('userRegistrationForm', this.userRegistrationForm);
  }

  resetUserIdForm() {
    this.userIdForm.reset();
    this.userIdForm.get('id').enable();
    console.log(this.userIdForm);
  }
}
