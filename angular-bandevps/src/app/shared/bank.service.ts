import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {BankAccountData, MovementInfo, CreditCardData} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private info = 'info';
  private movements = 'movements';
  private accountsDbPath = 'bank_accounts';
  private accountsInfoDbPath = `${this.accountsDbPath}_${this.info}`;
  private accountsMovementsDbPath = `${this.accountsDbPath}_${this.movements}`;
  private cardsDbPath = 'credit_cards';
  private cardsInfoDbPath = `${this.cardsDbPath}_${this.info}`;
  private cardsMovementsDbPath = `${this.cardsDbPath}_${this.movements}`;

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
            reject('INVALID_CARD_ID');
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
                type: this.formatType(movementsJSON[movementId].credit),
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

  getCreditCardsFromFirebaseWithId(id: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(this.cardsDbPath)
        .orderByChild('user_id')
        .equalTo(id)
        .once('value')
        .then((dataSnapshot: DataSnapshot) => {
          if (dataSnapshot.exists()) {
            const cardsJSON = dataSnapshot.toJSON();
            const cardsIds = Object.keys(dataSnapshot.exportVal());
            const cards: CreditCardData[] = cardsIds.map((cardId) => {
              return {
                id: cardId,
                number: cardsJSON[cardId].number,
                display: this.formatCreditCardNumber(cardsJSON[cardId].number)
              };
            });
            resolve(cards);
          } else {
            reject('NO_CARDS');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCreditCardInfoFromFirebaseWithCardId(cardId: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(this.cardsInfoDbPath)
        .child(cardId)
        .once('value')
        .then((result) => {
          if (
            !!result &&
            !!result.val() &&
            'balance_usd' in result.val() &&
            'limit_usd' in result.val() &&
            'type' in result.val()
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

  getCardMovementsFromFirebaseWithCardIdAndDates(
    cardId: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`${this.cardsMovementsDbPath}/${cardId}`)
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
                type: this.formatType(movementsJSON[movementId].credit),
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

  formatCreditCardNumber(cardNumber: string) {
    const first = cardNumber.slice(0, -4).replace(/\d/g, '*');
    const last = cardNumber.slice(-4);
    return `${first}${last}`;
  }
}
