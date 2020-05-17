import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const firebaseConfig = {
      apiKey: 'AIzaSyARsjA9CZbHoWDgAeGL0WT9yaU0pAF2Dzc',
      authDomain: 'bandevps.firebaseapp.com',
      databaseURL: 'https://bandevps.firebaseio.com',
      projectId: 'bandevps',
      storageBucket: 'bandevps.appspot.com',
      messagingSenderId: '599206278889',
      appId: '1:599206278889:web:7c859893de8d4b58152278',
      measurementId: 'G-7SWYX42XQ2'
    };
    firebase.initializeApp(firebaseConfig);
  }

  title = 'angular-bandevps';
}
