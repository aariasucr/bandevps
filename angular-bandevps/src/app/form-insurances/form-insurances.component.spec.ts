import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInsurancesComponent } from './form-insurances.component';

describe('FormInsurancesComponent', () => {
  let component: FormInsurancesComponent;
  let fixture: ComponentFixture<FormInsurancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInsurancesComponent ]
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
});
