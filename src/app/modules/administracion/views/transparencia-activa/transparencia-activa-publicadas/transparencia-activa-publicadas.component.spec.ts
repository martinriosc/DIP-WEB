import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaActivaPublicadasComponent } from './transparencia-activa-publicadas.component';

describe('TransparenciaActivaPublicadasComponent', () => {
  let component: TransparenciaActivaPublicadasComponent;
  let fixture: ComponentFixture<TransparenciaActivaPublicadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaActivaPublicadasComponent]
    });
    fixture = TestBed.createComponent(TransparenciaActivaPublicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
