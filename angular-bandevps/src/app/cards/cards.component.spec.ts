import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {CardsComponent} from './cards.component';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {Input, Component, EventEmitter} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {By} from '@angular/platform-browser';
import {SpinnerService} from '../shared/spinner.service';

@Component({
  selector: 'app-movements',
  template: '<p>Mock Movements Child Component</p>'
})
class MockMovementsComponent {
  @Input() data: any;
}

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  const mockStatusChange: any = new EventEmitter<any>();
  const mockUserData = {
    id: '102340567',
    fullName: 'Nombre Apellido Apellido'
  };
  const mockUserService: any = {
    statusChange: mockStatusChange
  };
  const mockCreditCards = [
    {
      id: 'abc',
      userId: '102340567',
      number: '12345678',
      display: '****5678'
    },
    {
      id: 'def',
      userId: '102340567',
      number: '98765432',
      display: '****5432'
    }
  ];
  const mockCreditCardInfo = {
    limit_usd: 4000,
    balance_usd: 2000,
    type: 'VISA'
  };
  const mockAngularFireAuth: any = {};
  const mockBankService: any = {
    getCreditCardsFromFirebaseWithId(id) {
      if (id === '102340567') {
        return Promise.resolve(mockCreditCards);
      }
    },
    getCreditCardInfoFromFirebaseWithCardId(cardId) {
      if (cardId === 'def') {
        return Promise.resolve(mockCreditCardInfo);
      }
    }
  };

  let cardChangeSpy: jasmine.Spy;
  let spinnerService: SpinnerService;
  let spinnerSpy: jasmine.Spy;

  // Mocks de forms
  let mockCardSelectionForm: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      declarations: [CardsComponent, MockMovementsComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: BankService, useValue: mockBankService},
        {provide: AngularFireAuth, useValue: mockAngularFireAuth}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockCardSelectionForm = new FormGroup({
      selectedCard: new FormControl('')
    });
    component.cardSelectionForm = mockCardSelectionForm;

    cardChangeSpy = spyOn(component, 'changeSelectedCard').and.callThrough();
    spinnerService = fixture.debugElement.injector.get(SpinnerService);
    spinnerSpy = spyOn(spinnerService, 'showMainSpinner');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getCardOptions = () => {
    return fixture.debugElement.queryAll(By.css('.cardOption'));
  };

  it('should load cards in card form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    let selectCardOptions = getCardOptions();
    expect(selectCardOptions).toEqual(Array());
    tick();
    fixture.detectChanges();
    selectCardOptions = getCardOptions();
    expect(selectCardOptions).not.toEqual(Array());
  }));

  it('should detect card selection in card form field', fakeAsync(() => {
    expect(component.card).toBeFalsy();
    mockUserService.statusChange.emit(mockUserData);
    tick();
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select[name=card]')).nativeElement;
    select.value = '2: Object';
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(spinnerSpy).toHaveBeenCalled();
    expect(spinnerSpy.calls.all().length).toEqual(1);
    expect(cardChangeSpy).toHaveBeenCalled();
    expect(component.cardSelectionForm.get('selectedCard').value.id).toBe('def');
    expect(component.cardSelectionForm.get('selectedCard').value.number).toBe('98765432');
    expect(component.isCardSet).toBeTruthy();
    expect(component.isCardInfoSet).toBeTruthy();
    expect(component.card.limit_usd).toBe(4000);
    expect(component.card.balance_usd).toBe(2000);
    expect(component.card.type).toBe('VISA');
  }));
});
