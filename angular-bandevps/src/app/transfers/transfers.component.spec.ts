import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {TransfersComponent} from './transfers.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {ModalModule} from 'ngx-bootstrap/modal';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import {EventEmitter} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('TransfersComponent', () => {
  let component: TransfersComponent;
  let fixture: ComponentFixture<TransfersComponent>;

  const mockStatusChange: any = new EventEmitter<any>();
  const mockUserData = {
    id: '102340567',
    fullName: 'Nombre Apellido Apellido'
  };
  const mockBankAccounts = [
    {
      id: 'abc',
      userId: '102340567',
      number: 'CR123',
      display: 'CR123'
    },
    {
      id: 'def',
      userId: '102340567',
      number: 'CR456',
      display: 'CR456'
    }
  ];
  const mockBankAccountInfo = {
    currency: 'CRC',
    balance: 100000,
    balanceRef: null,
    destinationAccounts: [
      {
        id: 'def',
        userId: '102340567',
        number: 'CR456',
        display: 'CR456'
      },
      {
        id: 'xyz',
        userId: '114430432',
        number: 'CR789',
        display: 'CR789'
      }
    ]
  };
  const mockDestinationBankAccountInfo = {
    userFullName: mockUserData.fullName,
    currency: 'USD',
    balanceRef: null
  };
  const mockAngularFireAuth: any = {};
  const mockBankService: any = {
    getBankAccountsFromFirebaseWithId(id) {
      if (id === '102340567') {
        return Promise.resolve(mockBankAccounts);
      }
    },
    getBankAccountInfoFromFirebaseWithAccountId(accountId) {
      if (accountId === 'abc') {
        return Promise.resolve(mockBankAccountInfo);
      }
    },
    getDestinationBankAccountInfoFromFirebase(ownerId, accountId) {
      if (ownerId === '102340567' && accountId === 'def') {
        return Promise.resolve(mockDestinationBankAccountInfo);
      }
    }
  };
  const mockUserService: any = {
    statusChange: mockStatusChange
  };

  let sourceAccountChangeSpy: jasmine.Spy;
  let destinationAccountChangeSpy: jasmine.Spy;

  // Mocks de forms
  let mockSourceAccountSelectionForm: FormGroup;
  let mockDestinationAccountSelectionForm: FormGroup;
  let mockTransferForm: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        ToastrModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [TransfersComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: BankService, useValue: mockBankService},
        {provide: AngularFireAuth, useValue: mockAngularFireAuth}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockSourceAccountSelectionForm = new FormGroup({
      sourceAccount: new FormControl('')
    });
    mockDestinationAccountSelectionForm = new FormGroup({
      destinationAccount: new FormControl('')
    });
    mockTransferForm = new FormGroup({
      amount: new FormControl(''),
      detail: new FormControl('')
    });
    component.sourceAccountSelectionForm = mockSourceAccountSelectionForm;
    component.destinationAccountSelectionForm = mockDestinationAccountSelectionForm;
    component.transferForm = mockTransferForm;

    sourceAccountChangeSpy = spyOn(component, 'changeSelectedSourceAccount').and.callThrough();
    destinationAccountChangeSpy = spyOn(
      component,
      'changeSelectedDestinationAccount'
    ).and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in completing transfer mode', () => {
    expect(component.mode).toBe('completing');
  });

  it('should load accounts in source account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    let selectOptions = fixture.debugElement.queryAll(By.css('.sourceAccountOption'));
    expect(selectOptions).toEqual(Array());
    tick();
    fixture.detectChanges();
    selectOptions = fixture.debugElement.queryAll(By.css('.sourceAccountOption'));
    expect(selectOptions).not.toEqual(Array());
  }));

  it('should ignore invalid account selection in source account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    expect(component.sourceAccountSelectionForm.get('sourceAccount').value).toBeFalsy();
    tick();
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select[name=sourceAccount]')).nativeElement;
    select.value = '';
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(sourceAccountChangeSpy).toHaveBeenCalled();
    expect(component.sourceAccountSelectionForm.get('sourceAccount').value).toBeFalsy();
    expect(component.isSourceAccountSet).toBeFalsy();
    expect(component.isSourceAccountInfoSet).toBeFalsy();
  }));

  it('should detect account selection in source account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    tick();
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select[name=sourceAccount]')).nativeElement;
    select.value = '1: Object';
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(sourceAccountChangeSpy).toHaveBeenCalled();
    expect(component.sourceAccountSelectionForm.get('sourceAccount').value.id).toBe('abc');
    expect(component.isSourceAccountSet).toBeTruthy();
    expect(component.isSourceAccountInfoSet).toBeTruthy();
  }));

  it('should load accounts in destination account form field when source account is loaded', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('select[name=destinationAccount]'))).toBeFalsy();
    mockUserService.statusChange.emit(mockUserData);
    tick();
    fixture.detectChanges();
    const selectSourceAccount = fixture.debugElement.query(By.css('select[name=sourceAccount]'))
      .nativeElement;
    selectSourceAccount.value = '1: Object';
    selectSourceAccount.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    const selectDestinationAccount = fixture.debugElement.query(
      By.css('select[name=destinationAccount]')
    ).nativeElement;
    expect(selectDestinationAccount).toBeTruthy();
    const selectDestinationAccountOptions = fixture.debugElement.queryAll(
      By.css('.destinationAccountOption')
    );
    expect(selectDestinationAccountOptions).not.toEqual(Array());
    expect(destinationAccountChangeSpy).not.toHaveBeenCalled();
    expect(component.isDestinationAccountSet).toBeFalsy();
    expect(component.isDestinationAccountInfoSet).toBeFalsy();
  }));

  it('should detect account selection in destination account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    tick();
    fixture.detectChanges();
    const selectSourceAccount = fixture.debugElement.query(By.css('select[name=sourceAccount]'))
      .nativeElement;
    selectSourceAccount.value = '1: Object';
    selectSourceAccount.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    const selectDestinationAccount = fixture.debugElement.query(
      By.css('select[name=destinationAccount]')
    ).nativeElement;
    selectDestinationAccount.value = '1: Object';
    selectDestinationAccount.dispatchEvent(new Event('change'));
    expect(destinationAccountChangeSpy).toHaveBeenCalled();
    tick();
    fixture.detectChanges();
    expect(component.isDestinationAccountSet).toBeTruthy();
    expect(component.isDestinationAccountInfoSet).toBeTruthy();
  }));
});
