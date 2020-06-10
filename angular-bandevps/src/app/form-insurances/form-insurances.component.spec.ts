import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
});
