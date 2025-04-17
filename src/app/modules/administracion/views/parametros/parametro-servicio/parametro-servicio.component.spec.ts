import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroServicioComponent } from './parametro-servicio.component';

describe('ParametroServicioComponent', () => {
  let component: ParametroServicioComponent;
  let fixture: ComponentFixture<ParametroServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroServicioComponent]
    });
    fixture = TestBed.createComponent(ParametroServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
