import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {FormGroup, FormControl} from '@angular/forms';
import {BankAccountData, BankAccountInfo, DestinationBankAccountInfo  } from '../shared/models';
import {Observable, Subscription, of} from 'rxjs';
import {NotificationService} from '../shared/notification.service';

enum TransferError {
  INVALID_AMOUNT,
  INSUFFICIENT_FUNDS,
  ERROR
}

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
  destinationAccount: DestinationBankAccountInfo;
  isDestinationAccountSet = false;
  isDestinationAccountInfoSet = false;

  private userSubscription: Subscription = null;

  constructor(
    private userService: UserService,
    private bankService: BankService,
    private notificationService: NotificationService
  ) {}

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

      this.destinationAccountSelectionForm.reset();
      this.isDestinationAccountSet = false;
      this.isDestinationAccountInfoSet = false;
      this.transferForm.reset();

      this.bankService
        .getBankAccountInfoFromFirebaseWithAccountId(accountId, ['destinationAccounts'])
        .then((result: any) => {
          this.sourceAccount = {
            id: accountId,
            number: accountNumber,
            currency: result.currency,
            balance: result.balance
          };
          this.destinationAccounts = of(result.destinationAccounts).pipe();
          this.isSourceAccountInfoSet = true;
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
      const accountId = this.destinationAccountSelectionForm.get('destinationAccount').value.id;
      const ownerId = this.destinationAccountSelectionForm.get('destinationAccount').value.userId;
      const accountNumber = this.destinationAccountSelectionForm.get('destinationAccount').value
        .number;
      this.isDestinationAccountSet = true;

      console.log(accountId);
      console.log(ownerId);
      console.log(accountNumber);

      this.transferForm.reset();

      this.bankService
        .getDestinationBankAccountInfoFromFirebase(ownerId, accountId)
        .then((result: any) => {
          this.destinationAccount = {
            id: accountId,
            userId: ownerId,
            userFullName: result.userFullName,
            number: accountNumber,
            currency: result.currency
          };
          this.isDestinationAccountInfoSet = true;
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      this.isDestinationAccountSet = false;
    }
  }

  onSubmitTransferForm() {
    // Se deshabilita el botón para evitar una segunda transferencia mientras se realiza el procesamiento
    this.transferForm.setErrors({invalid: true});

    this.bankService
      .processTransfer(
        this.transferForm.get('amount').value,
        this.transferForm.get('detail').value,
        this.destinationAccount,
        this.sourceAccount
      )
      .then((result) => {
        console.log('result', result);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        // Se rehabilita el botón para permitir más transferencias
        this.transferForm.setErrors(null);
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
