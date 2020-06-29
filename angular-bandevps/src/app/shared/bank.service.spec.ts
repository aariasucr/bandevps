import {TestBed} from '@angular/core/testing';

import {BankService} from './bank.service';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';

describe('BankService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ]
    })
  );

  it('should be created', () => {
    const service: BankService = TestBed.get(BankService);
    expect(service).toBeTruthy();
  });

  it('should hide first credit card digits', () => {
    const service: BankService = TestBed.get(BankService);
    const creditCard1 = '1234';
    const creditCard2 = '12345678';
    const maskedCreditCard1 = service.formatCreditCardNumber(creditCard1);
    const maskedCreditCard2 = service.formatCreditCardNumber(creditCard2);
    expect(maskedCreditCard1).toBe('1234');
    expect(maskedCreditCard2).toBe('****5678');
  });
});
