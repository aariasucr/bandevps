import {Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import {CreditCardInfo, CreditCardData, MovementInfo} from '../shared/models';
import {FormGroup, FormControl} from '@angular/forms';
import {Observable, Subscription, of} from 'rxjs';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, OnDestroy, AfterContentChecked {
  cardSelectionForm: FormGroup;
  cardMovementsForm: FormGroup;
  cards: Observable<CreditCardData[]>;
  card: CreditCardInfo;
  isCardSet = false;
  isCardInfoSet = false;
  showCardMovementsResults = false;
  cardHasMovements = false;
  maxDate: Date;
  cardMovements: MovementInfo[];
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
          .getCreditCardsFromFirebaseWithId(userData.id)
          .then((result: CreditCardData[]) => {
            this.cards = of(result).pipe();
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
    });

    this.cardSelectionForm = new FormGroup({
      selectedCard: new FormControl('')
    });

    this.cardMovementsForm = new FormGroup({
      dateRange: new FormControl([new Date(), new Date()])
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  changeSelectedCard(event) {
    const value = event.target.value;
    if (!!value) {
      const cardId = this.cardSelectionForm.get('selectedCard').value.id;
      const cardNumber = this.cardSelectionForm.get('selectedCard').value.number;
      this.isCardSet = true;

      console.log(cardId);
      console.log(cardNumber);

      this.bankService
        .getCreditCardInfoFromFirebaseWithCardId(cardId)
        .then((result: any) => {
          this.card = {
            id: cardId,
            number: cardNumber,
            limit_usd: result.limit_usd,
            balance_usd: result.balance_usd
          };
          this.isCardInfoSet = true;
          this.cardMovementsForm.reset();
          this.showCardMovementsResults = false;
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      this.isCardSet = false;
    }
  }

  onSubmitCardMovementsForm() {
    const dateRangeField = this.cardMovementsForm.get('dateRange').value;
    const startTimestamp = this.getDateTimestamp(dateRangeField[0], true);
    const endTimestamp = this.getDateTimestamp(dateRangeField[1], false);

    this.bankService
      .getCardMovementsFromFirebaseWithCardIdAndDates(this.card.id, startTimestamp, endTimestamp)
      .then((result: MovementInfo[]) => {
        this.cardMovements = result;
        this.cardHasMovements = true;
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        this.showCardMovementsResults = true;
      });
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
