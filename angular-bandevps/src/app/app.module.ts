import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent, APP_TITLE} from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';

import {UserService} from './shared/user.service';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RouteGuard} from './shared/route-guard';
import {HeaderComponent} from './header/header.component';
import {TimerService} from './shared/timer.service';
import {NotificationService} from './shared/notification.service';
import {TimerComponent} from './timer/timer.component';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers} from './state/reducers';
import {ApplicationEffects} from './state/application/effects';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, HeaderComponent, TimerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ApplicationEffects])
  ],
  providers: [
    UserService,
    RouteGuard,
    TimerService,
    NotificationService,
    {provide: APP_TITLE, useValue: 'The Iron Bank'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
