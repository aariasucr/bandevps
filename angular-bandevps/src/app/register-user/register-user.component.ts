import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import {SpinnerService} from '../shared/spinner.service';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserData, UserInformation} from '../shared/models';
import {NotificationService} from '../shared/notification.service';
import {Router} from '@angular/router';

enum RegistrationError {
  INVALID_CLIENT,
  ALREADY_REGISTERED,
  INVALID_PASSWORD,
  ERROR
}

export const differentPasswordsValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const pass = control.get('password');
  const passConf = control.get('passwordConf');

  return pass && passConf && pass.value !== passConf.value
    ? {differentPasswordsValidator: true}
    : null;
};

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  userIdForm: FormGroup;
  userRegistrationForm: FormGroup;
  userCanRegister = false;
  private userData: UserData;

  constructor(
    private spinnerService: SpinnerService,
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userIdForm = new FormGroup({
      id: new FormControl('')
    });
    this.userRegistrationForm = new FormGroup(
      {
        name: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        passwordConf: new FormControl(''),
        phoneNumber: new FormControl(''),
        address: new FormControl(''),
        occupation: new FormControl('')
      },
      {validators: differentPasswordsValidator}
    );
  }

  onSubmitUserIdForm() {
    this.spinnerService.showMainSpinner();

    this.checkUserCanRegister()
      .then((userData: UserData) => {
        this.userData = userData;
        const maskedEmail = this.getMaskedEmail(this.userData.email);
        this.userCanRegister = true;
        this.userIdForm.get('id').disable();
        this.userRegistrationForm.get('name').patchValue(this.userData.fullName);
        this.userRegistrationForm.get('name').disable();
        this.userRegistrationForm.get('email').patchValue(maskedEmail);
        this.userRegistrationForm.get('email').disable();
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        this.spinnerService.hideMainSpinner();
      });
  }

  onSubmitUserRegistrationForm() {
    this.spinnerService.showMainSpinner();

    this.registerUser()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        this.spinnerService.hideMainSpinner();
      });
  }

  resetForms() {
    this.resetUserIdForm();
    this.userRegistrationForm.reset();
  }

  resetUserIdForm() {
    this.userIdForm.reset();
    this.userIdForm.get('id').enable();
  }

  checkUserCanRegister() {
    const id = this.userIdForm.get('id').value;

    return new Promise((resolve, reject) => {
      this.userService
        .getUserDataFromFirebaseWithId(id)
        .then((idResult: UserData) => {
          // Usuario se encuentra en colección de users => usuario que es cliente del banco

          // Campo registered debe ser válido
          if (idResult.registered) {
            // Usuario ya se ha registrado para el sistema en línea => no continuar registro
            reject(RegistrationError.ALREADY_REGISTERED);
          } else {
            // Usuario no se ha registrado para el sistema en línea => continuar registro
            resolve(idResult);
          }
        })
        .catch((error) => {
          console.log('error', error);
          // Usuario no se encuentra en colección de users => usuario que no es cliente del banco => no continuar registro
          reject(RegistrationError.INVALID_CLIENT);
        });
    });
  }

  registerUser() {
    const email = this.userData.email;
    const password = this.userRegistrationForm.get('password').value;
    const userInfo: UserInformation = {
      adress: this.userRegistrationForm.get('address').value,
      occupation: this.userRegistrationForm.get('occupation').value,
      phoneNumber: this.userRegistrationForm.get('phoneNumber').value
    };
    let firstStepCompleted = false;

    return new Promise((resolve, reject) => {
      this.userService
        .insertUserInfoAndSetUserRegistered(this.userData, userInfo)
        .then(() => {
          firstStepCompleted = true;
          return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
        })
        .then((result) => {
          console.log('result', result);
          resolve();
        })
        .catch((error) => {
          let registrationError;
          switch (error.code) {
            case 'auth/weak-password':
              registrationError = RegistrationError.INVALID_PASSWORD;
              break;
            default:
              registrationError = RegistrationError.ERROR;
              break;
          }
          if (firstStepCompleted) {
            this.userService.invalidateUser(this.userData);
          }
          reject(registrationError);
        });
    });
  }

  getMaskedEmail(email) {
    const regexp = /(?<first>[\w-])(?<middle>[\w-]+)(?<last>@[\w-]+\.+[\w-]+)/;
    const {first, middle, last} = email.match(regexp).groups;
    const mask = middle.replace(/[\w-]/gi, '*');
    return `${first}${mask}${last}`;
  }
}
