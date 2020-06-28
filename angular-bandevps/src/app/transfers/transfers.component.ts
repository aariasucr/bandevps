import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {FormGroup, FormControl} from '@angular/forms';
import {
  BankAccountData,
  BankAccountInfo,
  DestinationBankAccountInfo,
  BankAccountsTransfer,
  UserData
} from '../shared/models';
import {Observable, Subscription, of} from 'rxjs';
import {NotificationService} from '../shared/notification.service';
import {SpinnerService} from '../shared/spinner.service';

enum TransferError {
  INVALID_AMOUNT,
  INSUFFICIENT_FUNDS,
  ERROR
}

enum TransferModes {
  COMPLETING = 'completing',
  VERIFYING = 'verifying',
  CONFIRMED = 'confirmed'
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
  mode = TransferModes.COMPLETING;

  sourceAccounts: Observable<BankAccountData[]>;
  sourceAccount: BankAccountInfo;
  isSourceAccountSet = false;
  isSourceAccountInfoSet = false;

  destinationAccounts: Observable<BankAccountData[]>;
  destinationAccount: DestinationBankAccountInfo;
  isDestinationAccountSet = false;
  isDestinationAccountInfoSet = false;

  transfer: BankAccountsTransfer;
  transferDateTime: string;

  userData: UserData;

  private userSubscription: Subscription = null;

  constructor(
    private userService: UserService,
    private bankService: BankService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
        this.bankService
          .getBankAccountsFromFirebaseWithId(userData.id)
          .then((result: BankAccountData[]) => {
            this.sourceAccounts = of(result).pipe();
          })
          .catch((error) => {
            // console.log('error', error);
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

    this.restartTransfer();
  }

  changeSelectedSourceAccount(event) {
    const value = event.target.value;
    if (!!value) {
      const accountId = this.sourceAccountSelectionForm.get('sourceAccount').value.id;
      const accountNumber = this.sourceAccountSelectionForm.get('sourceAccount').value.number;
      this.isSourceAccountSet = true;

      this.destinationAccountSelectionForm.reset();
      this.isDestinationAccountSet = false;
      this.isDestinationAccountInfoSet = false;
      this.transferForm.reset();

      this.spinnerService.showMainSpinner();

      this.bankService
        .getBankAccountInfoFromFirebaseWithAccountId(accountId, ['destinationAccounts'])
        .then((result: any) => {
          this.sourceAccount = {
            id: accountId,
            number: accountNumber,
            currency: result.currency,
            balance: result.balance,
            balanceRef: result.balanceRef
          };
          this.destinationAccounts = of(result.destinationAccounts).pipe();
          this.isSourceAccountInfoSet = true;
        })
        .catch((error) => {
          // console.log('error', error);
        })
        .finally(() => {
          this.spinnerService.hideMainSpinner();
        });
    } else {
      this.isSourceAccountSet = false;
    }
  }

  changeSelectedDestinationAccount(event) {
    const value = event.target.value;
    if (!!value) {
      const accountId = this.destinationAccountSelectionForm.get('destinationAccount').value.id;
      const ownerId = this.destinationAccountSelectionForm.get('destinationAccount').value.userId;
      const accountNumber = this.destinationAccountSelectionForm.get('destinationAccount').value
        .number;
      this.isDestinationAccountSet = true;

      this.transferForm.reset();

      this.spinnerService.showMainSpinner();

      this.bankService
        .getDestinationBankAccountInfoFromFirebase(ownerId, accountId)
        .then((result: any) => {
          this.destinationAccount = {
            id: accountId,
            userId: ownerId,
            userFullName: result.userFullName,
            number: accountNumber,
            currency: result.currency,
            balanceRef: result.balanceRef
          };
          this.isDestinationAccountInfoSet = true;
        })
        .catch((error) => {
          // console.log('error', error);
        })
        .finally(() => {
          this.spinnerService.hideMainSpinner();
        });
    } else {
      this.isDestinationAccountSet = false;
    }
  }

  verifyTransfer() {
    // Se deshabilita el botón para evitar una segunda transferencia mientras se realiza el procesamiento
    this.transferForm.setErrors({invalid: true});
    this.spinnerService.showMainSpinner();
    this.bankService
      .verifyTransfer(
        this.transferForm.get('amount').value,
        this.transferForm.get('detail').value,
        this.destinationAccount,
        this.sourceAccount
      )
      .then((result: BankAccountsTransfer) => {
        console.log('result', result);
        this.transfer = result;
        this.mode = TransferModes.VERIFYING;
      })
      .catch((error) => {
        // console.log('error', error);
        let errorMessage;
        if (error === TransferError.INVALID_AMOUNT) {
          errorMessage = 'El monto ingresado es inválido.';
        } else if (error === TransferError.INSUFFICIENT_FUNDS) {
          errorMessage = 'Los fondos de la cuenta son insuficientes.';
        } else {
          errorMessage = 'Ha ocurrido un error. Por favor verifique los datos e intente de nuevo.';
        }
        this.notificationService.showErrorMessage(
          'Error al verificar la transferencia',
          errorMessage
        );
      })
      .finally(() => {
        // Se rehabilita el botón para permitir más transferencias
        this.transferForm.setErrors(null);
        this.spinnerService.hideMainSpinner();
      });
  }

  returnToTransferForm() {
    this.transfer = null;
    this.mode = TransferModes.COMPLETING;
  }

  processTransfer() {
    this.spinnerService.showMainSpinner();
    this.bankService
      .processTransfer(this.transfer)
      .then((result: string) => {
        console.log('result', result);
        this.transferDateTime = result;
        this.mode = TransferModes.CONFIRMED;
      })
      .catch((error) => {
        // console.log('error', error);
        this.notificationService.showErrorMessage(
          'Error al procesar la transferencia',
          'Ha ocurrido un error. Por favor verifique los datos e intente de nuevo.'
        );
      })
      .finally(() => {
        this.spinnerService.hideMainSpinner();
      });
  }

  newTransfer() {
    this.restartTransfer();
  }

  restartTransfer() {
    this.mode = TransferModes.COMPLETING;
    this.isSourceAccountSet = false;
    this.isSourceAccountInfoSet = false;
    this.isDestinationAccountSet = false;
    this.isDestinationAccountInfoSet = false;
    this.transfer = null;
    this.transferDateTime = null;
    this.sourceAccountSelectionForm.reset();
    this.destinationAccountSelectionForm.reset();
    this.transferForm.reset();
  }

  getTransferModeTitle() {
    let title;
    switch (this.mode) {
      case TransferModes.COMPLETING:
        title = 'Transferencia';
        break;
      case TransferModes.VERIFYING:
        title = 'Verificación';
        break;
      case TransferModes.CONFIRMED:
        title = 'Confirmación';
        break;
    }
    return title;
  }

  getTransferModeText() {
    let text;
    switch (this.mode) {
      case TransferModes.COMPLETING:
        text = '';
        break;
      case TransferModes.VERIFYING:
        text = 'Por favor verifique los datos y confirme la transferencia';
        break;
      case TransferModes.CONFIRMED:
        text = 'La transferencia de fondos ha concluido satisfactoriamente';
        break;
    }
    return text;
  }

  getTransferModeAmountText(credit) {
    let text;
    switch (this.mode) {
      case TransferModes.COMPLETING:
        text = '';
        break;
      case TransferModes.VERIFYING:
        text = credit ? 'Monto que será transferido' : 'Monto que será debitado';
        break;
      case TransferModes.CONFIRMED:
        text = credit ? 'Monto transferido' : 'Monto debitado';
        break;
    }
    return text;
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
