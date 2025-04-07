import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso17ConfirmacionDatosComponent } from './paso-17-confirmacion-datos.component';

describe('Paso17ConfirmacionDatosComponent', () => {
  let component: Paso17ConfirmacionDatosComponent;
  let fixture: ComponentFixture<Paso17ConfirmacionDatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso17ConfirmacionDatosComponent]
    });
    fixture = TestBed.createComponent(Paso17ConfirmacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
