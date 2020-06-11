import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-form-insurances',
  templateUrl: './form-insurances.component.html',
  styleUrls: ['./form-insurances.component.css']
})
export class FormInsurancesComponent implements OnInit {
  public contactForm: FormGroup;
  public seguroViaje: Boolean=false;
  public seguroMedico:Boolean;
  public seguroVida:Boolean;
  public identificacion:Boolean;
  numInt:number[]=[1,2,3,4];
  seleccionado:number;

  constructor(public fb: FormBuilder) {

    this.contactForm = this.createFormTrav();

  }


  createFormTrav() {
    return new FormGroup({
      nombreDeSolicitante: new FormControl('', [Validators.required]),
      fechaDeSalida: new FormControl('', [Validators.required]),
      fechaDeRegreso: new FormControl('', [Validators.required]),
      numViajeros: new FormControl('', [Validators.required]),
      cantDiasEst:new FormControl('', [Validators.required]),
      identifi:new FormControl('', [Validators.required]),
      numBeneficiarios:new FormControl('', [Validators.required]),
      cantBenfSegVida:new FormControl('', [Validators.required])

    });
  }
  resetForm() {
    this.contactForm.reset();
  }
  onSaveForm() {}
  ngOnInit() {

  }

  isSubmitted = false;

  insurances: String[] = ['Viajero', 'Medico', 'Vida'];

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

      alert(this.registrationForm.get('ins').value);


      if(this.registrationForm.get('ins').value=="1: Viajero"){
        this.seguroViaje = true;
        this.seguroMedico=false;
        this.seguroVida=false;
      }else{
        if(this.registrationForm.get('ins').value=="2: Medico"){
          this.seguroViaje = false;
          this.seguroMedico=true;
          this.seguroVida=false;
        }else{
          if(this.registrationForm.get('ins').value=="3: Vida"){
            this.seguroViaje = false;
            this.seguroMedico=false;
            this.seguroVida=true;
          }

        }
      }
    }
  }
}
