import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountsComponent} from './accounts.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DataTablesModule} from 'angular-datatables';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {Component, Input} from '@angular/core';

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
      declarations: [AccountsComponent, MockMovementsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
