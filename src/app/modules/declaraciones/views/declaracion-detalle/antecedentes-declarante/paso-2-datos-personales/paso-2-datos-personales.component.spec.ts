import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso2DatosPersonalesComponent } from './paso-2-datos-personales.component';

describe('Paso2DatosPersonalesComponent', () => {
  let component: Paso2DatosPersonalesComponent;
  let fixture: ComponentFixture<Paso2DatosPersonalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso2DatosPersonalesComponent]
    });
    fixture = TestBed.createComponent(Paso2DatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
