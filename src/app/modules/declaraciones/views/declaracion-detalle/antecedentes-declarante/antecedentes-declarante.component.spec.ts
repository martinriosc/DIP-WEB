import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesDeclaranteComponent } from './antecedentes-declarante.component';

describe('AntecedentesDeclaranteComponent', () => {
  let component: AntecedentesDeclaranteComponent;
  let fixture: ComponentFixture<AntecedentesDeclaranteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntecedentesDeclaranteComponent]
    });
    fixture = TestBed.createComponent(AntecedentesDeclaranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
