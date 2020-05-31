import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {SpinnerService} from '../shared/spinner.service';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserData} from '../shared/models';

enum RegistrationError {
  INVALID_CLIENT,
  ALREADY_REGISTERED
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  userIdForm: FormGroup;
  userRegistrationForm: FormGroup;
  userCanRegister = false;

  constructor(
    private spinnerService: SpinnerService,
    private userService: UserService,
    private firebaseAuth: AngularFireAuth
  ) {}

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

  onSubmitUserIdForm() {
    console.log('userIdForm', this.userIdForm);
    this.spinnerService.showMainSpinner();

    this.checkUserCanRegister()
      .then((userDataValue) => {
        const userData: UserData = userDataValue;
        const maskedEmail = this.getMaskedEmail(userData.email);
        console.log(userData);
        this.userCanRegister = true;
        this.userIdForm.get('id').disable();
        this.userRegistrationForm.get('name').patchValue(userData.fullName);
        this.userRegistrationForm.get('name').disable();
        this.userRegistrationForm.get('email').patchValue(maskedEmail);
        this.userRegistrationForm.get('email').disable();
        console.log('userRegistrationForm', this.userRegistrationForm);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        this.spinnerService.hideMainSpinner();
      });
  }

  onSubmitUserRegistrationForm() {
    console.log('userRegistrationForm', this.userRegistrationForm);
  }

  resetUserIdForm() {
    this.userIdForm.reset();
    this.userIdForm.get('id').enable();
    console.log(this.userIdForm);
  }

  checkUserCanRegister() {
    const id = this.userIdForm.get('id').value;

    return new Promise((resolve, reject) => {
      this.userService
        .getUserDataFromFirebase(id)
        .then((userDataResult) => {
          // Usuario se encuentra en colección de users => usuario que es cliente del banco

          // Campo registered debe ser válido
          if (!!userDataResult && 'registered' in userDataResult.val()) {
            if (userDataResult.val().registered) {
              // Usuario ya se ha registrado para el sistema en línea => no continuar registro
              reject(RegistrationError.INVALID_CLIENT);
            } else {
              // Usuario no se ha registrado para el sistema en línea => continuar registro
              console.log(userDataResult.val());
              resolve(userDataResult.val());
            }
          } else {
            reject(RegistrationError.INVALID_CLIENT);
          }
        })
        .catch((error) => {
          // Usuario no se encuentra en colección de users => usuario que no es cliente del banco => no continuar registro
          console.log('error', error);
          reject(RegistrationError.INVALID_CLIENT);
        });
    });
  }

  registerUser() {}

  getMaskedEmail(email) {
    const regexp = /(?<first>[\w-])(?<middle>[\w-]+)(?<last>@[\w-]+\.+[\w-]+)/;
    const {first, middle, last} = email.match(regexp).groups;
    const mask = middle.replace(/[\w-]/gi, '*');
    return `${first}${mask}${last}`;
  }
}
