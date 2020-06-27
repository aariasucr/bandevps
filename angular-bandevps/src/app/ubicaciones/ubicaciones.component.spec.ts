import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionesComponent } from './ubicaciones.component';
import { AgmMap } from '@agm/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';

describe('UbicacionesComponent', () => {
  let component: UbicacionesComponent;
  let fixture: ComponentFixture<UbicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionesComponent],
      imports:[AgmMap,AngularFireDatabaseModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
