import {Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy} from '@angular/core';
import {BankAccountInfo, BankAccountData, MovementInfo} from '../shared/models';
import {FormGroup, FormControl} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {Subscription, Observable, of} from 'rxjs';
import * as moment from 'moment';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy, AfterContentChecked {
  accountSelectionForm: FormGroup;
  accountMovementsForm: FormGroup;
  accounts: Observable<BankAccountData[]>;
  account: BankAccountInfo;
  isAccountSet = false;
  isAccountInfoSet = false;
  showAccountMovementsResults = false;
  accountHasMovements = false;
  maxDate: Date;
  accountMovements: MovementInfo[];
  private userSubscription: Subscription = null;

  constructor(
    private userService: UserService,
    private bankService: BankService,
    private cdRef: ChangeDetectorRef,
    private localeService: BsLocaleService
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.localeService.use('es');

    this.userSubscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.bankService
          .getBankAccountsFromFirebaseWithId(userData.id)
          .then((result: BankAccountData[]) => {
            this.accounts = of(result).pipe();
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
    });

    this.accountSelectionForm = new FormGroup({
      selectedAccount: new FormControl('')
    });

    this.accountMovementsForm = new FormGroup({
      dateRange: new FormControl([new Date(), new Date()])
    });
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  changeSelectedAccount(event) {
    const value = event.target.value;
    if (!!value) {
      const accountId = this.accountSelectionForm.get('selectedAccount').value.id;
      const accountNumber = this.accountSelectionForm.get('selectedAccount').value.number;
      this.isAccountSet = true;

      console.log(accountId);
      console.log(accountNumber);

      this.bankService
        .getBankAccountInfoFromFirebaseWithAccountId(accountId)
        .then((result: any) => {
          this.account = {
            id: accountId,
            number: accountNumber,
            currency: result.currency,
            balance: result.balance
          };
          this.isAccountInfoSet = true;
          this.accountMovementsForm.reset();
          this.showAccountMovementsResults = false;
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      this.isAccountSet = false;
    }
  }

  onSubmitAccountMovementsForm() {
    const dateRangeField = this.accountMovementsForm.get('dateRange').value;
    const startTimestamp = this.getDateTimestamp(dateRangeField[0], true);
    const endTimestamp = this.getDateTimestamp(dateRangeField[1], false);

    this.bankService
      .getAccountMovementsFromFirebaseWithAccountIdAndDates(
        this.account.id,
        startTimestamp,
        endTimestamp
      )
      .then((result: MovementInfo[]) => {
        this.accountMovements = result;
        this.accountHasMovements = true;
      })
      .catch((error) => {
        this.accountMovements = [];
        this.accountHasMovements = false;
        console.log('error', error);
      })
      .finally(() => {
        this.showAccountMovementsResults = true;
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getDateTimestamp(date: string, isStartDate: boolean) {
    const momentDate = moment(date).set({
      hour: isStartDate ? 0 : 23,
      minute: isStartDate ? 0 : 59,
      second: isStartDate ? 0 : 59,
      millisecond: isStartDate ? 0 : 999
    });
    return momentDate.valueOf();
  }
}
