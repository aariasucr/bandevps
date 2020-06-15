import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {BankAccountData, MovementInfo} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private accountsDbPath = 'bank_accounts';
  private accountsInfoDbPath = 'bank_accounts_info';
  private accountsMovementsDbPath = 'bank_accounts_movements';
  private cardsDbPath = 'credit_cards';
  private cardsInfoDbPath = 'credit_cards_info';
  private cardsMovementsDbPath = 'credit_cards_movements';

  constructor(private firebaseDatabase: AngularFireDatabase) {}

  getBankAccountsFromFirebaseWithId(id: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(this.accountsDbPath)
        .orderByChild('user_id')
        .equalTo(id)
        .once('value')
        .then((dataSnapshot: DataSnapshot) => {
          if (dataSnapshot.exists()) {
            const accountsJSON = dataSnapshot.toJSON();
            const accountsIds = Object.keys(dataSnapshot.exportVal());
            const accounts: BankAccountData[] = accountsIds.map((accountId) => {
              return {
                id: accountId,
                number: accountsJSON[accountId].number,
                display: accountsJSON[accountId].number
              };
            });
            resolve(accounts);
          } else {
            reject('NO_ACCOUNTS');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getBankAccountInfoFromFirebaseWithAccountId(accountId: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(this.accountsInfoDbPath)
        .child(accountId)
        .once('value')
        .then((result) => {
          if (
            !!result &&
            !!result.val() &&
            'currency' in result.val() &&
            'balance' in result.val()
          ) {
            resolve(result.val());
          } else {
            reject('INVALID_ACCOUNT_ID');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAccountMovementsFromFirebaseWithAccountIdAndDates(
    accountId: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`${this.accountsMovementsDbPath}/${accountId}`)
        .orderByChild('timestamp')
        .startAt(startTimestamp)
        .endAt(endTimestamp)
        .once('value')
        .then((dataSnapshot: DataSnapshot) => {
          if (dataSnapshot.exists()) {
            const movementsJSON = dataSnapshot.toJSON();
            const movementsIds = Object.keys(dataSnapshot.exportVal());
            const movements: MovementInfo[] = movementsIds.map((movementId) => {
              return {
                date: this.formatDate(movementsJSON[movementId].date),
                type: this.formatType(movementsJSON[movementId].credit), // ? 'Crédito' : 'Débito',
                detail: movementsJSON[movementId].detail,
                amount: movementsJSON[movementId].amount
              };
            });
            resolve(movements);
          } else {
            reject('NO_MOVEMENTS');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  formatType(isCredit: boolean) {
    return isCredit ? 'Crédito' : 'Débito';
  }

  formatDate(dateISOString: string) {
    return moment(dateISOString).format('DD/MM/YYYY');
  }
}
