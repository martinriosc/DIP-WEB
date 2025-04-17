import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroPdfReservadoComponent } from './parametro-pdf-reservado.component';

describe('ParametroPdfReservadoComponent', () => {
  let component: ParametroPdfReservadoComponent;
  let fixture: ComponentFixture<ParametroPdfReservadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroPdfReservadoComponent]
    });
    fixture = TestBed.createComponent(ParametroPdfReservadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
