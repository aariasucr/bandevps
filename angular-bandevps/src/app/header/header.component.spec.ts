import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {APP_TITLE} from '../app.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
      ],
      declarations: [HeaderComponent],
      providers: [{provide: APP_TITLE, useValue: 'The Iron Bank'}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'The Iron Bank'`, () => {
    const header = fixture.debugElement.componentInstance;
    expect(header.title).toEqual('The Iron Bank');
  });

  it(`should have as logoutString 'Salir'`, () => {
    const header = fixture.debugElement.componentInstance;
    expect(header.logoutString).toEqual('Salir');
  });

  it('should render logoutString in an anchor element if user is logged in', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const header = fixture.debugElement.componentInstance;
    if (header.isLoggedIn) {
      expect(compiled.querySelector('a').textContent).toContain('Salir');
    } else {
      // En este caso no debe haber ningún elemento anchor en el componente
      // Si se tienen que incoporar más elementos al componente y esto ya no se cumple,
      // la prueba podría ser expect(compiled.querySelector('a').textContent).not.toContain('Salir');
      expect(compiled.querySelector('a')).not.toBeTruthy();
    }
  });
});
