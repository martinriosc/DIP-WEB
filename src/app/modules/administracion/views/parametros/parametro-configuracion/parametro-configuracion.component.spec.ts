import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroConfiguracionComponent } from './parametro-configuracion.component';

describe('ParametroConfiguracionComponent', () => {
  let component: ParametroConfiguracionComponent;
  let fixture: ComponentFixture<ParametroConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroConfiguracionComponent]
    });
    fixture = TestBed.createComponent(ParametroConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
