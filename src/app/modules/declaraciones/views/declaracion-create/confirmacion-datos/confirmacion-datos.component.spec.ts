import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDatosComponent } from './confirmacion-datos.component';

describe('ConfirmacionDatosComponent', () => {
  let component: ConfirmacionDatosComponent;
  let fixture: ComponentFixture<ConfirmacionDatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionDatosComponent]
    });
    fixture = TestBed.createComponent(ConfirmacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
