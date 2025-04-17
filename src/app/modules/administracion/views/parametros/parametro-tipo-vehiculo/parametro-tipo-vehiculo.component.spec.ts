import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroTipoVehiculoComponent } from './parametro-tipo-vehiculo.component';

describe('ParametroTipoVehiculoComponent', () => {
  let component: ParametroTipoVehiculoComponent;
  let fixture: ComponentFixture<ParametroTipoVehiculoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroTipoVehiculoComponent]
    });
    fixture = TestBed.createComponent(ParametroTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
