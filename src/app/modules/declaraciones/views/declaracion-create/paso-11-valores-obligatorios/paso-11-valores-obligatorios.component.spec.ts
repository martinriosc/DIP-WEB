import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso11ValoresObligatoriosComponent } from './paso-11-valores-obligatorios.component';

describe('Paso11ValoresObligatoriosComponent', () => {
  let component: Paso11ValoresObligatoriosComponent;
  let fixture: ComponentFixture<Paso11ValoresObligatoriosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso11ValoresObligatoriosComponent]
    });
    fixture = TestBed.createComponent(Paso11ValoresObligatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
