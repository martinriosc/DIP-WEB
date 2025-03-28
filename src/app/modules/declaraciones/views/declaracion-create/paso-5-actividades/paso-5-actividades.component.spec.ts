import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso5ActividadesComponent } from './paso-5-actividades.component';

describe('Paso5ActividadesComponent', () => {
  let component: Paso5ActividadesComponent;
  let fixture: ComponentFixture<Paso5ActividadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso5ActividadesComponent]
    });
    fixture = TestBed.createComponent(Paso5ActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
