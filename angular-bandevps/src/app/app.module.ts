import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';

import {UserService} from './shared/user.service';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RouteGuard} from './shared/route-guard';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule
  ],
  providers: [UserService, RouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
