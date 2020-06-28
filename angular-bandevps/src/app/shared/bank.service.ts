import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {MovementInfo, UserData, DestinationBankAccountInfo, BankAccountInfo} from './models';
import {DataSnapshot} from '@angular/fire/database/interfaces';
import * as moment from 'moment';
import {UserService} from './user.service';

enum TransferError {
  INVALID_AMOUNT,
  INSUFFICIENT_FUNDS,
  ERROR
}

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
  private DOLLAR_EXCHANGE_RATE = 590;

  constructor(private firebaseDatabase: AngularFireDatabase, private userService: UserService) {}

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
                  userId: entitiesJSON[entityId].user_id,
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

  getBankAccountInfo(bankAccountValue, optionalAttributes) {
    if (Array.isArray(optionalAttributes) && optionalAttributes.length) {
      if (optionalAttributes.includes('destinationAccounts')) {
        let destinationAccounts = [];
        if ('destination_accounts' in bankAccountValue) {
          const rawDestinationAccounts = bankAccountValue.destination_accounts;
          const destinationAccountsIds = Object.keys(rawDestinationAccounts);
          destinationAccounts = destinationAccountsIds.map((destinationAccountId) => {
            return {
              id: destinationAccountId,
              userId: rawDestinationAccounts[destinationAccountId].user_id,
              number: rawDestinationAccounts[destinationAccountId].number,
              display: rawDestinationAccounts[destinationAccountId].number
            };
          });
        }
        bankAccountValue.destinationAccounts = destinationAccounts;
        return bankAccountValue;
      }
    }

    return bankAccountValue;
  }

  getBankAccountInfoFromFirebaseWithAccountId(
    accountId: string,
    optionalAttributes: Array<string> = []
  ) {
    return this.getBankEntityInfoFromFirebaseWithBankEntityId(
      'BankAccountInfo',
      this.accountsInfoDbPath,
      accountId,
      optionalAttributes
    );
  }

  getCreditCardInfoFromFirebaseWithCardId(cardId: string, optionalAttributes: Array<string> = []) {
    return this.getBankEntityInfoFromFirebaseWithBankEntityId(
      'CreditCardInfo',
      this.cardsInfoDbPath,
      cardId,
      optionalAttributes
    );
  }

  getBankEntityInfoFromFirebaseWithBankEntityId(
    targetClassName: string,
    path: string,
    bankEntityId: string,
    optionalAttributes
  ) {
    return new Promise((resolve, reject) => {
      const bankEntityIsBankAccountInfo = targetClassName === 'BankAccountInfo';
      const rejectValue = bankEntityIsBankAccountInfo ? 'INVALID_ACCOUNT_ID' : 'INVALID_CARD_ID';

      this.firebaseDatabase.database
        .ref(path)
        .child(bankEntityId)
        .once('value')
        .then((result) => {
          if (!!result && !!result.val()) {
            if (bankEntityIsBankAccountInfo) {
              const bankAccountInfo = this.getBankAccountInfo(result.val(), optionalAttributes);
              resolve(bankAccountInfo);
            } else {
              resolve(result.val());
            }
          } else {
            reject(rejectValue);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDestinationBankAccountInfoFromFirebase(userId: string, accountId: string) {
    return new Promise((resolve, reject) => {
      const finalResult = {
        userFullName: null,
        currency: null
      };

      this.userService
        .getUserDataFromFirebaseWithId(userId)
        .then((result: UserData) => {
          finalResult.userFullName = result.fullName;
          return this.firebaseDatabase.database
            .ref(this.accountsInfoDbPath)
            .child(accountId)
            .once('value');
        })
        .then((result) => {
          if (!!result && !!result.val()) {
            finalResult.currency = result.val().currency;
            resolve(finalResult);
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

  getExchangeRate(from: string, to: string) {
    if (from === 'USD' && to === 'CRC') {
      return this.DOLLAR_EXCHANGE_RATE;
    } else if (from === 'CRC' && to === 'USD') {
      return 1 / this.DOLLAR_EXCHANGE_RATE;
    }
  }

  processTransfer(
    amountString: string,
    transferDetail: string,
    destinationAccount: DestinationBankAccountInfo,
    sourceAccount: BankAccountInfo
  ) {
    return new Promise((resolve, reject) => {
      // Paso 1: Verificar que el monto se pueda parsear a float y que no sea negativo o igual a cero
      const parsedAmount = Number.parseFloat(amountString);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        reject(TransferError.INVALID_AMOUNT);
      }
      const calculatedCreditAmount = Number.parseFloat(parsedAmount.toFixed(2));

      // Paso 2: Convertir el monto de la transferencia a la moneda de la cuenta de origen. Eso es el monto del debito
      const conversionFactor =
        destinationAccount.currency === sourceAccount.currency
          ? 1
          : this.getExchangeRate(destinationAccount.currency, sourceAccount.currency);
      const calculatedDebitAmount = Number.parseFloat((parsedAmount * conversionFactor).toFixed(2));

      // Paso 3: Verificar que el monto calculado no excede el saldo de la cuenta de origen
      if (calculatedDebitAmount > sourceAccount.balance) {
        reject(TransferError.INSUFFICIENT_FUNDS);
      }

      // Paso 4: Procesar la transferencia

      console.log('id cuenta origen', sourceAccount.number);
      console.log('número cuenta origen', sourceAccount.number);
      console.log('moneda cuenta origen', sourceAccount.currency);
      console.log('saldo cuenta origen', sourceAccount.balance);
      console.log('monto quitar a cuenta origen', calculatedDebitAmount);
      console.log('id cuenta destino', destinationAccount.number);
      console.log('número cuenta destino', destinationAccount.number);
      console.log('moneda cuenta destino', destinationAccount.currency);
      console.log('monto poner en cuenta destino', calculatedCreditAmount);
      console.log('detalle transferencia', transferDetail);

      resolve(true);
    });
  }
}
