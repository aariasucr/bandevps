import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
@Component({
  selector: 'app-form-insurances',
  templateUrl: './form-insurances.component.html',
  styleUrls: ['./form-insurances.component.css']
})
export class FormInsurancesComponent implements OnInit {
  public contactForm: FormGroup;
  public seguroViaje: Boolean = false;
  public seguroMedico: Boolean = false;
  public seguroVida: Boolean = false;
  public identificacion: Boolean;
  seleccionado: number;

  constructor(public fb: FormBuilder, private af: AngularFireDatabase) {
    this.contactForm = this.createFormTrav();
  }

  createFormTrav() {
    return new FormGroup({
      nombreDeSolicitante: new FormControl('', [Validators.required]),
      fechaDeSalida: new FormControl('', [Validators.required]),
      fechaDeRegreso: new FormControl('', [Validators.required]),
      numViajeros: new FormControl('', [Validators.required]),
      cantDiasEst: new FormControl('', [Validators.required]),
      identifi: new FormControl('', [Validators.required]),
      numBeneficiarios: new FormControl('', [Validators.required]),
      cantBenfSegVida: new FormControl('', [Validators.required])
    });
  }
  resetForm() {
    this.contactForm.reset();
  }
  onSaveForm() {}
  ngOnInit() {}

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

  onSubmit() {
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      return false;
    } else {
      if (this.registrationForm.get('ins').value == '1: Viajero') {
        this.seguroViaje = true;
        this.seguroMedico = false;
        this.seguroVida = false;
      } else {
        if (this.registrationForm.get('ins').value == '2: Medico') {
          this.seguroViaje = false;
          this.seguroMedico = true;
          this.seguroVida = false;
        } else {
          if (this.registrationForm.get('ins').value == '3: Vida') {
            this.seguroViaje = false;
            this.seguroMedico = false;
            this.seguroVida = true;
          }
        }
      }
    }
  }
  sendForm() {
    if (this.seguroViaje == true) {
      const datos = {
        numViajeros: this.contactForm.get('numViajeros').value,
        cantDias: this.contactForm.get('cantDiasEst').value,
        message: 'solicitó el seguro viajero'
      };
      const date = Date();
      const html = `
        <div>From: ${this.contactForm.get('nombreDeSolicitante')}</div>
        <h1>Comprobante de solicitud
        <div>Date: ${date}</div>
        <div>Message: ${datos.message}</div>
      `;
      let formRequest = {datos, date, html};
      this.af.list('/messages').push(formRequest);
      this.registrationForm.reset();
    } else {
      if (this.seguroMedico == true) {
        const datos = {
          numeroBeneficiarios: this.contactForm.get('numBeneficiarios').value,
          tipoIden: this.contactForm.get('identifi').value,
          message: 'solicitó el seguro médico'
        };
        const date = Date();
        const html = `
        <div>From: ${this.contactForm.get('nombreDeSolicitante')}</div>
        <h1>Comprobante de solicitud
        <div>Date: ${date}</div>
        <div>Message: ${datos.message}</div>
      `;
        let formRequest = {datos, date, html};
        this.af.list('/messages').push(formRequest);
        this.registrationForm.reset();
        this.contactForm.reset();
      } else {
        if (this.seguroVida == true) {
      //     if (document.getElementById('planA').checked) {
      //       const datos = {
      //         cantBenfSegVid: this.contactForm.get('cantBenfSegVida').value,
      //         plan: 'Plan A($500)',
      //         message: 'solicitó el seguro médico'
      //       };
      //       const date = Date();
      //       const html = `
      //       <div>From: ${this.contactForm.get('nombreDeSolicitante')}</div>
      //       <h1>Comprobante de solicitud
      //       <div>Date: ${date}</div>
      //       <div>Message: ${datos.message}</div>
      //     `;
      //       let formRequest = {datos, date, html};
      //       this.af.list('/messages').push(formRequest);
      //       this.registrationForm.reset();
      //       this.contactForm.reset();
      //     } else if (document.getElementById('planB').checked) {
      //       const datos = {
      //         cantBenfSegVid: this.contactForm.get('cantBenfSegVida').value,
      //         plan: 'Plan B($1000)',
      //         message: 'solicitó el seguro médico'
      //       };
      //       const date = Date();
      //       const html = `
      //   <div>From: ${this.contactForm.get('nombreDeSolicitante')}</div>
      //   <h1>Comprobante de solicitud
      //   <div>Date: ${date}</div>
      //   <div>Message: ${datos.message}</div>
      // `;
      //       let formRequest = {datos, date, html};
      //       this.af.list('/messages').push(formRequest);
      //       this.registrationForm.reset();
      //       this.contactForm.reset();
      //     }
        }
      }
    }
  }
}
