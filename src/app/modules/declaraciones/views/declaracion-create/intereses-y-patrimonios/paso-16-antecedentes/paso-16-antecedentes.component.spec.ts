import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso16AntecedentesComponent } from './paso-16-antecedentes.component';

describe('Paso16AntecedentesComponent', () => {
  let component: Paso16AntecedentesComponent;
  let fixture: ComponentFixture<Paso16AntecedentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso16AntecedentesComponent]
    });
    fixture = TestBed.createComponent(Paso16AntecedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
