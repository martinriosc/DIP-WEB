import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso3EntidadComponent } from './paso-3-entidad.component';

describe('Paso3EntidadComponent', () => {
  let component: Paso3EntidadComponent;
  let fixture: ComponentFixture<Paso3EntidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso3EntidadComponent]
    });
    fixture = TestBed.createComponent(Paso3EntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
