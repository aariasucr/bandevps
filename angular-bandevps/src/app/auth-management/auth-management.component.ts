import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormGroup, FormControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import {NotificationService} from '../shared/notification.service';
import {SpinnerService} from '../shared/spinner.service';

enum AuthManagementActions {
  RESET_PASSWORD = 'resetPassword'
}

export const differentPasswordsValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const pass = control.get('newPassword');
  const passConf = control.get('confirmNewPassword');

  return pass && passConf && pass.value !== passConf.value
    ? {differentPasswordsValidator: true}
    : null;
};

@Component({
  selector: 'app-auth-management',
  templateUrl: './auth-management.component.html',
  styleUrls: ['./auth-management.component.css']
})
export class AuthManagementComponent implements OnInit, OnDestroy {
  userPasswordForm: FormGroup;
  actionCodeChecked: boolean;
  ngUnsubscribe: Subject<any> = new Subject<any>();
  // La acción de administración que se debe efectuar
  mode: string;
  modeParamKey = 'mode';
  // El código que provee Firebase para verificar que se trata de un password reset ()
  actionCode: string;
  actionCodeParamKey = 'oobCode';

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.userPasswordForm = new FormGroup(
      {
        newPassword: new FormControl(''),
        confirmNewPassword: new FormControl('')
      },
      {validators: differentPasswordsValidator}
    );

    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      // console.log(params);
      // Si no hay parámetros en el URL, no se puede realizar ninguna acción de administración y por lo tanto se navega a login
      if (!params || !(this.modeParamKey in params)) {
        this.router.navigate(['/login']);
      }

      this.mode = params[this.modeParamKey];

      if (this.mode === AuthManagementActions.RESET_PASSWORD) {
        // Si el parámetro oobCode no está en el URL, no se puede realizar la acción de reset password y por lo tanto se navega a login
        if (!(this.actionCodeParamKey in params)) {
          this.router.navigate(['/login']);
        } else {
          this.actionCode = params[this.actionCodeParamKey];
          this.spinnerService.showMainSpinner();
          let errorMessage;
          // Verificar que el código de password reset es válido
          this.firebaseAuth
            .verifyPasswordResetCode(this.actionCode)
            .then((email) => {
              this.actionCodeChecked = true;
            })
            .catch((error) => {
              // El código es inválido o expiró. Se debe solicitar al usuario que intente de nuevo el password reset
              errorMessage = 'El código para restablecer la contraseña es inválido o expiró.';
              this.router.navigate(['/login']);
            })
            .finally(() => {
              if (!!errorMessage) {
                this.notificationService.showAlert(
                  'Error al intentar restablecer la contraseña',
                  errorMessage
                );
              }
              this.spinnerService.hideMainSpinner();
            });
        }
      } else {
        // Si el parámetro mode en el URL no tiene un valor que pertenezca al conjunto de modos válidos,
        // no se puede realizar ninguna acción de administración y por lo tanto se navega a login
        this.router.navigate(['/login']);
      }

      switch (this.mode) {
        case AuthManagementActions.RESET_PASSWORD:
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleResetPassword() {
    // console.log('new password', this.userPasswordForm.get('newPassword').value);
    this.spinnerService.showMainSpinner();
    this.firebaseAuth
      .confirmPasswordReset(this.actionCode, this.userPasswordForm.get('newPassword').value)
      .then((resp) => {
        this.notificationService.showAlert(
          'Contraseña restablecida',
          'Se creó una nueva contraseña para su cuenta de usuario.'
        );
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // console.log(error);
        let errorMessage;
        const errorMessageTitle = 'Error al intentar restablecer la contraseña';
        if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña debe ser más segura. Incluya al menos seis caracteres.';
          this.notificationService.showErrorMessage(errorMessageTitle, errorMessage);
        } else {
          errorMessage = 'El código para restablecer la contraseña es inválido o expiró.';
          this.notificationService.showAlert(errorMessageTitle, errorMessage);
          this.router.navigate(['/login']);
        }
      })
      .finally(() => {
        this.spinnerService.hideMainSpinner();
      });
  }
}
