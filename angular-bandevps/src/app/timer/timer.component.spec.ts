import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TimerComponent} from './timer.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../state/reducers';
import {ToastrModule} from 'ngx-toastr';
import {EventEmitter} from '@angular/core';
import {UserService} from '../shared/user.service';
import {TimerService} from '../shared/timer.service';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  const mockStatusChange: any = new EventEmitter<any>();
  const mockTimeout: any = new EventEmitter<any>();

  const mockUserService: any = {
    statusChange: mockStatusChange
  };

  const mockTimerService: any = {
    timeout: mockTimeout,
    stop() {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers), ToastrModule.forRoot()],
      declarations: [TimerComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: TimerService, useValue: mockTimerService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    mockUserService.statusChange.emit(null);
    expect(component).toBeTruthy();
  });
});
