import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { FormInsurancesComponent } from './form-insurances.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('FormInsurancesComponent', () => {
  let component: FormInsurancesComponent;
  let fixture: ComponentFixture<FormInsurancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,FormsModule],
      declarations: [ FormInsurancesComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // const userRegistrationFormHidden = (mockUserIdFormForCase) => {

  //   component.onSubmit();
  //   tick();
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   const hidden = compiled.querySelector('[hidden]');
  //   expect(hidden.textContent).toContain('Contraseña');
  //   expect(hidden.textContent).toContain('Teléfono');
  //   expect(hidden.textContent).toContain('Ocupación');
  //   expect(hidden.textContent).toContain('Dirección');
  //   expect(hidden.textContent).toContain('Registrar');
  //   tick(10000);
  // };
});
