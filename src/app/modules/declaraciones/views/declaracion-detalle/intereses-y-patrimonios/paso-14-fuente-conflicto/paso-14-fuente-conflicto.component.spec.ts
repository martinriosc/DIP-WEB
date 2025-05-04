import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso14FuenteConflictoComponent } from './paso-14-fuente-conflicto.component';

describe('Paso14FuenteConflictoComponent', () => {
  let component: Paso14FuenteConflictoComponent;
  let fixture: ComponentFixture<Paso14FuenteConflictoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso14FuenteConflictoComponent]
    });
    fixture = TestBed.createComponent(Paso14FuenteConflictoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
