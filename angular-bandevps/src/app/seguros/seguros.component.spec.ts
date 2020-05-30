import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {AngularFireDatabase} from '@angular/fire/database';
import {SegurosComponent} from './seguros.component';
import { SegurosService } from '../shared/seguros.service';
//import {async as _async} from "rxjs/scheduler/async";
import { asyncScheduler, of } from 'rxjs';


fdescribe('SegurosComponent', () => {
  let component: SegurosComponent;
  let fixture: ComponentFixture<SegurosComponent>;

  // Mock de los datos de seguros
  const datosSeguros =  [
      {
        benefits: [
          {
            description: 'Cubre en cualquier parte del mundo',
            icon: 'avion'
          },
          {
            description: 'Indemnizaciones cubiertas',
            icon: 'money'
          },
          {
            description: 'Gastos médicos',
            icon: 'medical'
          }
        ],
        description: 'Esta es una descripción del seguro viajero',
        image: 'imgViajero',
        name: 'Seguro viajero'
      },
      {
        benefits: [
          {
            description: 'Cubre en cualquier parte del mundo',
            icon: 'clock'
          },
          {
            description: 'Atención medica telefónica',
            icon: 'phone'
          },
          {
            description: 'Gastos médicos',
            icon: 'redDeConexion'
          }
        ],
        description: 'Esta es una descripción del seguro viajero',
        image: 'imgMed',
        name: 'Seguro médico'
      },
      {
        benefits: [
          {
            description: 'Cubre en cualquier parte del mundo',
            icon: 'credMensual'
          },
          {
            description: 'Indemnizaciones cubiertas',
            icon: 'cobInmediata'
          },
          {
            description: 'Gastos médicos',
            icon: 'muerteAccid'
          }
        ],
        description: 'Esta es una descripción del seguro viajero',
        image: 'imgVida',
        name: 'Seguro de vida'
      }
    ];
  

  // Mock de la base de datos
  const mockDatabase: any = {
    list() {
      return {
        valueChanges() {
          return Promise.resolve(datosSeguros);
        }
      };
    }
  };

  const mockSeguroService: any = {
    getInsuranceList(){
      return of(datosSeguros,asyncScheduler);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // AngularFireModule.initializeApp(environment.firebaseConfig),
        // AngularFireDatabaseModule,
        // AngularFireAuthModule
      ],
      declarations: [SegurosComponent],
      providers: [{provide: AngularFireDatabase, useValue: mockDatabase},{provide: SegurosService, useValue: mockSeguroService}]
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

  it('should render insurances titles in h2 tag', fakeAsync(async() => {
    component.ngOnInit();
    tick(100);
    console.log(component.items)
    await fixture.whenStable();
    //expect(component.items).toBeTruthy();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    console.log(compiled.querySelector('h2'))
    expect(compiled.querySelector('h2').textContent).toContain('Seguro médico');
    expect(compiled.querySelector('h2').textContent).toContain('Seguro viajero');
    expect(compiled.querySelector('h2').textContent).toContain('Seguro de vida');
  }));
});
