import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {FormGroup, FormControl} from '@angular/forms';
import {BankAccountData, BankAccountInfo} from '../shared/models';
import {Observable, Subscription, of} from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit, OnDestroy {
  sourceAccountSelectionForm: FormGroup;
  destinationAccountSelectionForm: FormGroup;
  transferForm: FormGroup;

  sourceAccounts: Observable<BankAccountData[]>;
  sourceAccount: BankAccountInfo;
  isSourceAccountSet = false;
  isSourceAccountInfoSet = false;

  destinationAccounts: Observable<BankAccountData[]>;
  destinationAccount: BankAccountInfo;
  isDestinationAccountSet = false;
  isDestinationAccountInfoSet = false;

  private userSubscription: Subscription = null;

  constructor(private userService: UserService, private bankService: BankService) {}

  ngOnInit() {
    this.userSubscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.bankService
          .getBankAccountsFromFirebaseWithId(userData.id)
          .then((result: BankAccountData[]) => {
            this.sourceAccounts = of(result).pipe();
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
    });

    this.sourceAccountSelectionForm = new FormGroup({
      sourceAccount: new FormControl('')
    });

    this.destinationAccountSelectionForm = new FormGroup({
      destinationAccount: new FormControl('')
    });

    this.transferForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      currency: new FormControl(''),
      amount: new FormControl(''),
      detail: new FormControl('')
    });
  }

  changeSelectedSourceAccount(event) {
    const value = event.target.value;
    if (!!value) {
      const accountId = this.sourceAccountSelectionForm.get('sourceAccount').value.id;
      const accountNumber = this.sourceAccountSelectionForm.get('sourceAccount').value.number;
      this.isSourceAccountSet = true;

      console.log(accountId);
      console.log(accountNumber);

      this.bankService
        .getBankAccountInfoFromFirebaseWithAccountId(accountId, ['destinationAccounts'])
        .then((result: any) => {
          this.sourceAccount = {
            id: accountId,
            number: accountNumber,
            currency: result.currency,
            balance: result.balance
          };
          this.destinationAccountSelectionForm.reset();
          this.destinationAccounts = of(result.destinationAccounts).pipe();
          this.isSourceAccountInfoSet = true;
          this.transferForm.reset();
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      this.isSourceAccountSet = false;
    }
  }

  changeSelectedDestinationAccount(event) {
    const value = event.target.value;
    if (!!value) {
      console.log(
        'cuenta destino seleccionada',
        this.destinationAccountSelectionForm.get('destinationAccount').value
      );
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
