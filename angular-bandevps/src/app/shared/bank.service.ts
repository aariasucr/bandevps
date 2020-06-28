import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {
  MovementInfo,
  UserData,
  DestinationBankAccountInfo,
  BankAccountInfo,
  BankAccountsTransfer
} from './models';
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
  private TRANSFER_DETAIL_PRE_MESSAGE = 'TRANSFERENCIAS IRON BANK ONLINE';

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

  getBankAccountInfo(accountId, accountValue, optionalAttributes) {
    if (Array.isArray(optionalAttributes) && optionalAttributes.length) {
      if (optionalAttributes.includes('destinationAccounts')) {
        let destinationAccounts = [];
        if ('destination_accounts' in accountValue) {
          const rawDestinationAccounts = accountValue.destination_accounts;
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
        accountValue.destinationAccounts = destinationAccounts;
        accountValue.balanceRef = this.firebaseDatabase.database.ref(
          `${this.accountsInfoDbPath}/${accountId}/balance`
        );
        return accountValue;
      }
    }

    return accountValue;
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
              const bankAccountInfo = this.getBankAccountInfo(
                bankEntityId,
                result.val(),
                optionalAttributes
              );
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
        currency: null,
        balanceRef: null
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
            finalResult.balanceRef = this.firebaseDatabase.database.ref(
              `${this.accountsInfoDbPath}/${accountId}/balance`
            );
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

  formatDate(dateISOString: string, isDateTime = false) {
    return isDateTime
      ? moment(dateISOString).format('DD/MM/YYYY HH:mm:ss')
      : moment(dateISOString).format('DD/MM/YYYY');
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

  verifyTransfer(
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

      // Paso 4: Devolver la transferencia
      const transfer: BankAccountsTransfer = {
        sourceAccount,
        destinationAccount,
        creditAmount: calculatedCreditAmount,
        debitAmount: calculatedDebitAmount,
        detail: transferDetail
      };
      resolve(transfer);
    });
  }

  processTransfer(transfer: BankAccountsTransfer) {
    const momentDate = moment();
    const date = momentDate.toISOString(true);
    const timestamp = momentDate.valueOf();

    return new Promise((resolve, reject) => {
      this.getBankAccountInfoFromFirebaseWithAccountId(transfer.sourceAccount.id)
        .then((result: any) => {
          // Comparar saldo actual en cuenta de origen para verificar integridad de los datos que ya se tenían
          if (result.balance === transfer.sourceAccount.balance) {
            return transfer.sourceAccount.balanceRef.transaction((balance) => {
              const newBalance = balance - transfer.debitAmount;
              return newBalance;
            });
          } else {
            reject(TransferError.ERROR);
          }
        })
        .then((result) => {
          // console.log('result', result);
          return transfer.destinationAccount.balanceRef.transaction((balance) => {
            const newBalance = balance + transfer.creditAmount;
            return newBalance;
          });
        })
        .then((result) => {
          // console.log('result', result);
          const newCreditMovementKey = this.getBankAccountMovementKey(
            transfer.destinationAccount.id
          );
          const newDebitMovementKey = this.getBankAccountMovementKey(transfer.sourceAccount.id);
          const newCreditMovement = this.prepareBankAccountMovement(
            transfer.creditAmount,
            true,
            date,
            timestamp,
            transfer.detail
          );
          const newDebitMovement = this.prepareBankAccountMovement(
            transfer.debitAmount,
            false,
            date,
            timestamp,
            transfer.detail
          );
          const updates = {};
          updates[
            `${this.accountsMovementsDbPath}/${transfer.destinationAccount.id}/${newCreditMovementKey}`
          ] = newCreditMovement;
          updates[
            `${this.accountsMovementsDbPath}/${transfer.sourceAccount.id}/${newDebitMovementKey}`
          ] = newDebitMovement;
          return this.firebaseDatabase.database.ref().update(updates);
        })
        .then((result) => {
          // console.log('result', result);
          resolve(this.formatDate(date, true));
        })
        .catch((error) => {
          // console.log('error', error);
          reject(TransferError.ERROR);
        });
    });
  }

  getBankAccountMovementKey(accountId) {
    return this.firebaseDatabase.database
      .ref()
      .child(`${this.accountsMovementsDbPath}/${accountId}`)
      .push().key;
  }

  prepareBankAccountMovement(
    amount: number,
    credit: boolean,
    date: string,
    timestamp: number,
    detailPostMessage: string
  ) {
    return {
      amount,
      credit,
      date,
      timestamp,
      detail: `${this.TRANSFER_DETAIL_PRE_MESSAGE} - ${detailPostMessage}`
    };
  }
}
