import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent, APP_TITLE} from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';
import {AngularFirePerformanceModule} from '@angular/fire/performance';

import {UserService} from './shared/user.service';
import {HomeComponent} from './home/home.component';
import {SegurosComponent} from './seguros/seguros.component';
import {SegurosService} from './shared/seguros.service';
import {LoginComponent} from './login/login.component';
import {RouteGuard} from './shared/route-guard';
import {HeaderComponent} from './header/header.component';
import {RegisterUserComponent} from './register-user/register-user.component';
import {LoggedInUserRouteGuard} from './shared/logged-in-user-route-guard';
import {UserDataEditorComponent} from './user-data-editor/user-data-editor.component';
import {UserPasswordEditorComponent} from './user-password-editor/user-password-editor.component';
import {TimerService} from './shared/timer.service';
import {NotificationService} from './shared/notification.service';
import {TimerComponent} from './timer/timer.component';
import {ToastrModule} from 'ngx-toastr';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SpinnerService} from './shared/spinner.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditInformationComponent} from './edit-information/edit-information.component';
import {DataTablesModule} from 'angular-datatables';
import {AccountsComponent} from './accounts/accounts.component';
import {FormInsurancesComponent} from './form-insurances/form-insurances.component';
import {AboutUsComponent} from './about-us/about-us.component';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers} from './state/reducers';
import {ApplicationEffects} from './state/application/effects';
import {MovementsComponent} from './movements/movements.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AlertComponent} from './shared/modals/alert/alert.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {BankService} from './shared/bank.service';
import {CardsComponent} from './cards/cards.component';
import {ResetPasswordRequestComponent} from './reset-password-request/reset-password-request.component';
import {UtilsService} from './shared/utils.service';
import {AuthManagementComponent} from './auth-management/auth-management.component';
defineLocale('es', esLocale);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    TimerComponent,
    RegisterUserComponent,
    UserDataEditorComponent,
    UserPasswordEditorComponent,
    EditInformationComponent,
    SegurosComponent,
    MovementsComponent,
    AlertComponent,
    AccountsComponent,
    CardsComponent,
    FormInsurancesComponent,
    AboutUsComponent,
    ResetPasswordRequestComponent,
    AuthManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirePerformanceModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ApplicationEffects]),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    UserService,
    RouteGuard,
    {provide: APP_TITLE, useValue: 'The Iron Bank'},
    LoggedInUserRouteGuard,
    TimerService,
    NotificationService,
    SpinnerService,
    SegurosService,
    BankService,
    UtilsService
  ],
  entryComponents: [AlertComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
