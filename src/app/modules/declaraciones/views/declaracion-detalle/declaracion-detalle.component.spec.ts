import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionDetalleComponent } from './declaracion-detalle.component';

describe('DeclaracionDetalleComponent', () => {
  let component: DeclaracionDetalleComponent;
  let fixture: ComponentFixture<DeclaracionDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionDetalleComponent]
    });
    fixture = TestBed.createComponent(DeclaracionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
