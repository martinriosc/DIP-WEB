import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaActivaPendientesComponent } from './transparencia-activa-pendientes.component';

describe('TransparenciaActivaPendientesComponent', () => {
  let component: TransparenciaActivaPendientesComponent;
  let fixture: ComponentFixture<TransparenciaActivaPendientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaActivaPendientesComponent]
    });
    fixture = TestBed.createComponent(TransparenciaActivaPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
