import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {BankAccountData, BankAccountInfo} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private accountsDbPath = 'bank_accounts';
  private accountsInfoDbPath = 'bank_accounts_info';

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
}
