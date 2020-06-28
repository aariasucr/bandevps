import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {AccountsComponent} from './accounts.component';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DataTablesModule} from 'angular-datatables';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {Component, Input, EventEmitter} from '@angular/core';
import {By} from '@angular/platform-browser';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';
import { SpinnerService } from '../shared/spinner.service';

@Component({
  selector: 'app-movements',
  template: '<p>Mock Movements Child Component</p>'
})
class MockMovementsComponent {
  @Input() data: any;
}

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  const mockStatusChange: any = new EventEmitter<any>();
  const mockUserData = {
    id: '102340567',
    fullName: 'Nombre Apellido Apellido'
  };
  const mockUserService: any = {
    statusChange: mockStatusChange
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
    destinationAccounts: null
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
    }
  };

  let accountChangeSpy: jasmine.Spy;
  let spinnerService: SpinnerService;
  let spinnerSpy: jasmine.Spy;

  // Mocks de forms
  let mockAccountSelectionForm: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        DataTablesModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      declarations: [AccountsComponent, MockMovementsComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: BankService, useValue: mockBankService},
        {provide: AngularFireAuth, useValue: mockAngularFireAuth}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockAccountSelectionForm = new FormGroup({
      selectedAccount: new FormControl('')
    });
    component.accountSelectionForm = mockAccountSelectionForm;

    accountChangeSpy = spyOn(component, 'changeSelectedAccount').and.callThrough();
    spinnerService = fixture.debugElement.injector.get(SpinnerService);
    spinnerSpy = spyOn(spinnerService, 'showMainSpinner');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts in account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    let selectOptions = fixture.debugElement.queryAll(By.css('.accountOption'));
    expect(selectOptions).toEqual(Array());
    tick();
    fixture.detectChanges();
    selectOptions = fixture.debugElement.queryAll(By.css('.accountOption'));
    expect(selectOptions).not.toEqual(Array());
  }));

  it('should detect account selection in account form field', fakeAsync(() => {
    mockUserService.statusChange.emit(mockUserData);
    tick();
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select[name=account]')).nativeElement;
    select.value = '1: Object';
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(spinnerSpy).toHaveBeenCalled();
    expect(spinnerSpy.calls.all().length).toEqual(1);
    expect(accountChangeSpy).toHaveBeenCalled();
    expect(component.accountSelectionForm.get('selectedAccount').value.id).toBe('abc');
    expect(component.accountSelectionForm.get('selectedAccount').value.number).toBe('CR123');
    expect(component.isAccountSet).toBeTruthy();
    expect(component.isAccountInfoSet).toBeTruthy();
  }));
});
