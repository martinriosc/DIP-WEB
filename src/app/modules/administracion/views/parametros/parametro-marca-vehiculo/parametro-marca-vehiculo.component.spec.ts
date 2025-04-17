import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroMarcaVehiculoComponent } from './parametro-marca-vehiculo.component';

describe('ParametroMarcaVehiculoComponent', () => {
  let component: ParametroMarcaVehiculoComponent;
  let fixture: ComponentFixture<ParametroMarcaVehiculoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroMarcaVehiculoComponent]
    });
    fixture = TestBed.createComponent(ParametroMarcaVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
