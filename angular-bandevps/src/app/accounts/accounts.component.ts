import {Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy} from '@angular/core';
import {BankAccountInfo, BankAccountData} from '../shared/models';
import {FormGroup, FormControl} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {Subscription, Observable, of} from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy, AfterContentChecked {
  accountSelectionForm: FormGroup;
  accounts: Observable<BankAccountData[]>;
  account: BankAccountInfo;
  isAccountSet = false;
  isAccountInfoSet = false;
  private userSubscription: Subscription = null;

  constructor(
    private userService: UserService,
    private bankService: BankService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      this.isAccountSet = false;
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
