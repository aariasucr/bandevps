import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-form-insurances',
  templateUrl: './form-insurances.component.html',
  styleUrls: ['./form-insurances.component.css']
})
export class FormInsurancesComponent implements OnInit {
  public contactForm: FormGroup;
  public seguroViaje: Boolean;

  constructor(public fb: FormBuilder) {
    this.contactForm = this.createFormTrav();
  }
  createFormTrav() {
    return new FormGroup({
      nombreDeSolicitante: new FormControl('', [Validators.required]),
      fechaDeSalida: new FormControl('', [Validators.required]),
      fechaDeRegreso: new FormControl('', [Validators.required]),
      numViajeros: new FormControl('', [Validators.required])
    });
  }
  resetForm() {
    this.contactForm.reset();
  }
  onSaveForm() {}
  ngOnInit() {}

  isSubmitted = false;

  insurances: any = ['Viajero', 'Medico', 'Vida'];

  /*########### Form ###########*/
  registrationForm = this.fb.group({
    ins: ['', [Validators.required]]
  });

  // Choose city using select dropdown
  changeCity(e) {
    console.log(e.value);
    this.InsuranceName.setValue(e.target.value, {
      onlySelf: true
    });
  }

  get InsuranceName() {
    return this.registrationForm.get('ins');
  }

  /*########### Template Driven Form ###########*/
  onSubmit() {
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      return false;
    } else {
      this.seguroViaje = true;
      alert(JSON.stringify(this.registrationForm.value));
    }
  }
}
