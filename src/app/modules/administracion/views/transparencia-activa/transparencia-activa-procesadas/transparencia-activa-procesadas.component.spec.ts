import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaActivaProcesadasComponent } from './transparencia-activa-procesadas.component';

describe('TransparenciaActivaProcesadasComponent', () => {
  let component: TransparenciaActivaProcesadasComponent;
  let fixture: ComponentFixture<TransparenciaActivaProcesadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaActivaProcesadasComponent]
    });
    fixture = TestBed.createComponent(TransparenciaActivaProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
