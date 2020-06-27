import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserData} from '../shared/models';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/notification.service';
import {SpinnerService} from '../shared/spinner.service';
import {UtilsService} from '../shared/utils.service';

enum ResetPasswordError {
  INVALID_CLIENT,
  NOT_REGISTERED,
  ERROR
}

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent implements OnInit {
  userIdForm: FormGroup;

  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.userIdForm = new FormGroup({
      id: new FormControl('')
    });
  }

  onSubmit() {
    this.spinnerService.showMainSpinner();
    let errorMessage;
    let maskedEmail;
    this.checkUserCanResetPassword()
      .then((userData: UserData) => {
        console.log('result', userData);
        console.log('email', userData.email);
        maskedEmail = this.utilsService.getMaskedEmail(userData.email);
        return this.firebaseAuth.sendPasswordResetEmail(userData.email);
      })
      .then(() => {
        if (!!maskedEmail) {
          this.notificationService.showAlert(
            'Correo electrónico enviado',
            `Se envió el correo para restablecimiento de contraseña a la dirección ${maskedEmail}.`
          );
        }
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        if (error === ResetPasswordError.INVALID_CLIENT) {
          errorMessage =
            'No se encontró ningún cliente para el número de identificación ingresado.';
        } else if (error === ResetPasswordError.NOT_REGISTERED) {
          errorMessage =
            'No existe una cuenta de usuario para el número de identificación ingresado.';
        } else {
          errorMessage = 'Ha ocurrido un error. Por favor verifique los datos e intente de nuevo.';
        }
      })
      .finally(() => {
        if (!!errorMessage) {
          this.notificationService.showErrorMessage(
            'Error al intentar restablecer la contraseña',
            errorMessage
          );
        }
        this.spinnerService.hideMainSpinner();
      });
  }

  checkUserCanResetPassword() {
    const id = this.userIdForm.get('id').value;

    return new Promise((resolve, reject) => {
      this.userService
        .getUserDataFromFirebaseWithId(id)
        .then((idResult: UserData) => {
          // Usuario se encuentra en colección de users => usuario que es cliente del banco

          if (idResult.registered) {
            // Usuario ya se ha registrado para el sistema en línea => continuar
            resolve(idResult);
          } else {
            // Usuario no se ha registrado para el sistema en línea => no continuar
            reject(ResetPasswordError.NOT_REGISTERED);
          }
        })
        .catch((error) => {
          if (error === 'INVALID_ID') {
            // Usuario no se encuentra en colección de users => usuario que no es cliente del banco => no continuar
            reject(ResetPasswordError.INVALID_CLIENT);
          } else {
            // Otro tipo de error
            reject(error);
          }
        });
    });
  }
}
