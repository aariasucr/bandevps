import {async, ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {APP_TITLE} from '../app.component';
import {UserService} from '../shared/user.service';
import {EventEmitter} from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // Mock userData para userService
  const mockUserData = {
    uid: 'mock'
  };

  // Mock statusChange para userService
  const mockStatusChange: any = new EventEmitter<any>();

  // Mock userService
  const mockUserService: any = {
    statusChange: mockStatusChange
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: APP_TITLE, useValue: 'The Iron Bank'}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'The Iron Bank'`, () => {
    const header = fixture.debugElement.componentInstance;
    expect(header.title).toEqual('The Iron Bank');
  });

  it(`should have as logoutString 'Salir'`, () => {
    const header = fixture.debugElement.componentInstance;
    expect(header.logoutString).toEqual('Salir');
  });

  it('should render logoutString in an anchor element if user is logged in', fakeAsync(() => {
    component.ngOnInit();
    mockStatusChange.emit(mockUserData);
    console.log('isLoggedIn value in header component', component.getIsLoggedIn());
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Salir');
  }));

  it('should not render logoutString in an anchor element if user is not logged in', () => {
    component.ngOnInit();
    mockStatusChange.emit(null);
    console.log('isLoggedIn value in header component', component.getIsLoggedIn());
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // En este caso no debe haber ningún elemento anchor en el componente
    // Si se tienen que incoporar más elementos anchor al componente y lo anterior ya no se cumple,
    // la prueba podría ser expect(compiled.querySelector('a').textContent).not.toContain('Salir');
    expect(compiled.querySelector('a')).not.toBeTruthy();
  });
});
