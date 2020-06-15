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

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers} from './state/reducers';
import {ApplicationEffects} from './state/application/effects';
import {FormInsurancesComponent} from './form-insurances/form-insurances.component';
import {AboutUsComponent} from './about-us/about-us.component';

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
    FormInsurancesComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ApplicationEffects]),
    ToastrModule.forRoot()
  ],
  providers: [
    UserService,
    RouteGuard,
    {provide: APP_TITLE, useValue: 'The Iron Bank'},
    LoggedInUserRouteGuard,
    TimerService,
    NotificationService,
    SpinnerService,
    SegurosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
