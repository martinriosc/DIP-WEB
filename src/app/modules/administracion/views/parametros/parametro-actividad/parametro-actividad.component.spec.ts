import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroActividadComponent } from './parametro-actividad.component';

describe('ParametroActividadComponent', () => {
  let component: ParametroActividadComponent;
  let fixture: ComponentFixture<ParametroActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroActividadComponent]
    });
    fixture = TestBed.createComponent(ParametroActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
