import {async, ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {TimerComponent} from './timer.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../state/reducers';
import {ToastrModule} from 'ngx-toastr';
import {EventEmitter} from '@angular/core';
import {UserService} from '../shared/user.service';
import {TimerService} from '../shared/timer.service';
import {NotificationService} from '../shared/notification.service';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let notificationService: NotificationService;
  let notificationSpy: jasmine.Spy;
  const mockUserData = {
    uid: 'mock'
  };
  const mockStatusChange: any = new EventEmitter<any>();
  const mockTimeout: any = new EventEmitter<any>();

  const mockUserService: any = {
    statusChange: mockStatusChange,
    performLogout() {}
  };

  const mockTimerService: any = {
    timeout: mockTimeout,
    stop() {},
    start() {}
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

    notificationService = fixture.debugElement.injector.get(NotificationService);
    notificationSpy = spyOn(notificationService, 'showInfoMessageWithConfirmation');
  });

  it('should create', () => {
    mockUserService.statusChange.emit(null);
    expect(component).toBeTruthy();
  });

  it('should not notify session expired when logged in user and no timeout', () => {
    mockUserService.statusChange.emit(mockUserData);
    expect(notificationSpy).not.toHaveBeenCalled();
    expect(notificationSpy.calls.all().length).toEqual(0);
  });

  it('should notify session expired when logged in user and timeout', () => {
    mockUserService.statusChange.emit(mockUserData);
    mockTimerService.timeout.emit();
    expect(notificationSpy).toHaveBeenCalled();
    expect(notificationSpy.calls.all().length).toEqual(1);
  });
});
