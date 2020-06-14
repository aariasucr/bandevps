import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MovementsComponent} from './movements.component';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';

describe('MovementsComponent', () => {
  let component: MovementsComponent;
  let fixture: ComponentFixture<MovementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DataTablesModule, HttpClientModule],
      declarations: [MovementsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
