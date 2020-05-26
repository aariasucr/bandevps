import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {SegurosComponent} from './seguros.component';
import {SegurosService} from '../shared/seguros.service';

fdescribe('SegurosComponent', () => {
  let component: SegurosComponent;
  let fixture: ComponentFixture<SegurosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
      ],
      declarations: [SegurosComponent],
      providers: [SegurosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render insurances titles in h2 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Seguro médico');
    //expect(compiled.querySelector('h2').textContent).toContain('Seguro viajero');
    //expect(compiled.querySelector('h2').textContent).toContain('Seguro de vida');
  });
});
