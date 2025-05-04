import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso12MandatoEspecialComponent } from './paso-12-mandato-especial.component';

describe('Paso12MandatoEspecialComponent', () => {
  let component: Paso12MandatoEspecialComponent;
  let fixture: ComponentFixture<Paso12MandatoEspecialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso12MandatoEspecialComponent]
    });
    fixture = TestBed.createComponent(Paso12MandatoEspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
