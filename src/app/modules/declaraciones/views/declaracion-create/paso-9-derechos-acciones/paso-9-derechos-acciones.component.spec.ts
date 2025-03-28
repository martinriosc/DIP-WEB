import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso9DerechosAccionesComponent } from './paso-9-derechos-acciones.component';

describe('Paso9DerechosAccionesComponent', () => {
  let component: Paso9DerechosAccionesComponent;
  let fixture: ComponentFixture<Paso9DerechosAccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso9DerechosAccionesComponent]
    });
    fixture = TestBed.createComponent(Paso9DerechosAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
