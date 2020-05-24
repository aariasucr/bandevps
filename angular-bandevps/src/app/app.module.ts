import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';

import {UserService} from './shared/user.service';
import {HomeComponent} from './home/home.component';
import { SegurosComponent } from './seguros/seguros.component';
import { SegurosService } from './shared/seguros.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, SegurosComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [UserService,SegurosService],
  bootstrap: [AppComponent]
})
export class AppModule {}
