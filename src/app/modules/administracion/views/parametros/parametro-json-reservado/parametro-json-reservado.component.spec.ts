import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroJsonReservadoComponent } from './parametro-json-reservado.component';

describe('ParametroJsonReservadoComponent', () => {
  let component: ParametroJsonReservadoComponent;
  let fixture: ComponentFixture<ParametroJsonReservadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroJsonReservadoComponent]
    });
    fixture = TestBed.createComponent(ParametroJsonReservadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
