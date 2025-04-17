import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaActivaConErroresComponent } from './transparencia-activa-con-errores.component';

describe('TransparenciaActivaConErroresComponent', () => {
  let component: TransparenciaActivaConErroresComponent;
  let fixture: ComponentFixture<TransparenciaActivaConErroresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaActivaConErroresComponent]
    });
    fixture = TestBed.createComponent(TransparenciaActivaConErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
