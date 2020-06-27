import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/notification.service';
import {UserData} from '../shared/models';
import {AngularFirePerformance} from '@angular/fire/performance';
import * as firebase from 'firebase';
import {APP_TITLE} from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  screenTrace: firebase.performance.Trace;
  clientLoginAttemptTrace: firebase.performance.Trace;
  userLoginTrace: firebase.performance.Trace;

  constructor(
    private userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationService,
    private firebasePerf: AngularFirePerformance,
    @Inject(APP_TITLE) private appTitle: string
  ) {}

  ngOnInit() {
    if (!!this.firebasePerf) {
      this.firebasePerf.trace('loginScreen').then((trace) => {
        this.screenTrace = trace;
        this.screenTrace.start();
      });
      this.firebasePerf.trace('clientLoginAttempt').then((trace) => {
        this.clientLoginAttemptTrace = trace;
      });
      this.firebasePerf.trace('userLogin').then((trace) => {
        this.userLoginTrace = trace;
      });
    }
  }

  onSubmit(form: NgForm) {
    this.startLoginTrace(this.clientLoginAttemptTrace);
    this.startLoginTrace(this.userLoginTrace);

    const id = form.value.identificacion;
    const password = form.value.password;
    let userDataResult: UserData;
    let firstStepCompleted = false;
    this.userService
      .getUserDataFromFirebaseWithId(id)
      .then((idResult: UserData) => {
        userDataResult = idResult;
        console.log('userDataResult', userDataResult);
        this.trackLoginTraceAttribute(
          this.clientLoginAttemptTrace,
          'clientRegistered',
          `${userDataResult.registered}`
        );
        this.stopLoginTrace(this.clientLoginAttemptTrace);
        firstStepCompleted = true;
        return this.firebaseAuth.signInWithEmailAndPassword(userDataResult.email, password);
      })
      .then((signInResult) => {
        console.log('signInResult', signInResult);
        this.stopLoginTrace(this.userLoginTrace);
        this.userService.performLogin(signInResult, userDataResult);
        this.notificationService.showSuccessMessage('Sesión iniciada', 'Bienvenido');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('error', error);

        if (!firstStepCompleted) {
          this.trackLoginTraceAttribute(this.clientLoginAttemptTrace, 'error', `${error}`);
          this.trackLoginTraceAttribute(this.userLoginTrace, 'error', `${error}`);
          this.stopLoginTrace(this.clientLoginAttemptTrace);
        } else {
          this.trackLoginTraceAttribute(this.userLoginTrace, 'errorCode', `${error.code}`);
        }

        this.stopLoginTrace(this.userLoginTrace);

        this.notificationService.showErrorMessage('Error al iniciar sesión', error.message);
      });
  }

  ngOnDestroy() {
    if (!!this.firebasePerf) {
      this.screenTrace.stop();
    }
  }

  startLoginTrace(traceInstance) {
    if (traceInstance === this.userLoginTrace) {
      console.log('START USER LOGIN TRACE');
    } else if (traceInstance === this.clientLoginAttemptTrace) {
      console.log('START CLIENT LOGIN ATTEMPT TRACE');
    }

    if (!!this.firebasePerf && !!traceInstance) {
      traceInstance.start();
    }
  }

  stopLoginTrace(traceInstance) {
    if (!!this.firebasePerf && !!traceInstance) {
      traceInstance.stop();

      if (traceInstance === this.userLoginTrace) {
        console.log('STOP USER LOGIN TRACE');
        this.firebasePerf.trace('userLogin').then((trace) => {
          this.userLoginTrace = trace;
        });
      } else if (traceInstance === this.clientLoginAttemptTrace) {
        console.log('STOP CLIENT LOGIN ATTEMPT TRACE');
        this.firebasePerf.trace('clientLoginAttempt').then((trace) => {
          this.clientLoginAttemptTrace = trace;
        });
      }
    }
  }

  trackLoginTraceAttribute(traceInstance, attributeName: string, value: any) {
    if (!!this.firebasePerf && !!traceInstance) {
      traceInstance.putAttribute(attributeName, value);
    }
  }

  getAppTitle() {
    return this.appTitle;
  }
}
