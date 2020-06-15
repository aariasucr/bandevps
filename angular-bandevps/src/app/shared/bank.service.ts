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
    return this.getBankEntitiesFromFirebaseWithId('BankAccountData', this.accountsDbPath, id);
  }

  getCreditCardsFromFirebaseWithId(id: string) {
    return this.getBankEntitiesFromFirebaseWithId('CreditCardData', this.cardsDbPath, id);
  }

  getBankEntitiesFromFirebaseWithId(targetClassName: string, path: string, id: string) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(path)
        .orderByChild('user_id')
        .equalTo(id)
        .once('value')
        .then((dataSnapshot: DataSnapshot) => {
          if (dataSnapshot.exists()) {
            const entitiesJSON = dataSnapshot.toJSON();
            const jsonIds = Object.keys(dataSnapshot.exportVal());
            let entities: any[];
            entities = jsonIds.map((entityId) => {
              if (targetClassName === 'BankAccountData') {
                return {
                  id: entityId,
                  number: entitiesJSON[entityId].number,
                  display: entitiesJSON[entityId].number
                };
              } else {
                return {
                  id: entityId,
                  number: entitiesJSON[entityId].number,
                  display: this.formatCreditCardNumber(entitiesJSON[entityId].number)
                };
              }
            });
            resolve(entities);
          } else {
            if (targetClassName === 'BankAccountData') {
              reject('NO_ACCOUNTS');
            } else {
              reject('NO_CARDS');
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getBankAccountInfoFromFirebaseWithAccountId(accountId: string) {
    return this.getBankEntityInfoFromFirebaseWithBankEntityId(
      'BankAccountInfo',
      this.accountsInfoDbPath,
      accountId
    );
  }

  getCreditCardInfoFromFirebaseWithCardId(cardId: string) {
    return this.getBankEntityInfoFromFirebaseWithBankEntityId(
      'CreditCardInfo',
      this.cardsInfoDbPath,
      cardId
    );
  }

  getBankEntityInfoFromFirebaseWithBankEntityId(
    targetClassName: string,
    path: string,
    bankEntityId: string
  ) {
    return new Promise((resolve, reject) => {
      const rejectValue =
        targetClassName === 'BankAccountInfo' ? 'INVALID_ACCOUNT_ID' : 'INVALID_CARD_ID';

      this.firebaseDatabase.database
        .ref(path)
        .child(bankEntityId)
        .once('value')
        .then((result) => {
          if (!!result && !!result.val()) {
            resolve(result.val());
          } else {
            reject(rejectValue);
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
    return this.getBankEntityMovementsFromFirebaseWithBankEntityIdAndDates(
      this.accountsMovementsDbPath,
      accountId,
      startTimestamp,
      endTimestamp
    );
  }

  getCardMovementsFromFirebaseWithCardIdAndDates(
    cardId: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    return this.getBankEntityMovementsFromFirebaseWithBankEntityIdAndDates(
      this.cardsMovementsDbPath,
      cardId,
      startTimestamp,
      endTimestamp
    );
  }

  getBankEntityMovementsFromFirebaseWithBankEntityIdAndDates(
    path: string,
    bankEntityId: string,
    startTimestamp: number,
    endTimestamp: number
  ) {
    return new Promise((resolve, reject) => {
      this.firebaseDatabase.database
        .ref(`${path}/${bankEntityId}`)
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
                type: this.formatMovementType(movementsJSON[movementId].credit),
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

  formatMovementType(isCredit: boolean) {
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
