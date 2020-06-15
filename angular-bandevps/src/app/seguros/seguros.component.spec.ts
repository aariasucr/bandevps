import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SegurosComponent} from './seguros.component';
import {SegurosService} from '../shared/seguros.service';
import {asyncScheduler, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';

describe('SegurosComponent', () => {
  let component: SegurosComponent;
  let fixture: ComponentFixture<SegurosComponent>;

  const mockRouter: any = {navigate() {}};

  // Mock de los datos de seguros
  const datosSeguros = [
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

  const mockSeguroService: any = {
    getInsuranceList() {
      return of(datosSeguros, asyncScheduler);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SegurosComponent],
      providers: [
        {provide: SegurosService, useValue: mockSeguroService},
        {provide: Router, useValue: mockRouter}
      ]
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

  it('should render insurances titles in h2 tag', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // With nativeElement
      const h2 = compiled.querySelector('h2');
      expect(h2.textContent).toContain('Seguro viajero');

      // With debugElement
      const h2TestElems = fixture.debugElement.queryAll(By.css('h2'));
      const viajero = h2TestElems[0].nativeElement;
      const medico = h2TestElems[1].nativeElement;
      const vida = h2TestElems[2].nativeElement;
      expect(viajero.textContent).toContain('Seguro viajero');
      expect(medico.textContent).toContain('Seguro médico');
      expect(vida.textContent).toContain('Seguro de vida');
    });
  }));
});
