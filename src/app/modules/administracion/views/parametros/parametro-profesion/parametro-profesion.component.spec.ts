import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroProfesionComponent } from './parametro-profesion.component';

describe('ParametroProfesionComponent', () => {
  let component: ParametroProfesionComponent;
  let fixture: ComponentFixture<ParametroProfesionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroProfesionComponent]
    });
    fixture = TestBed.createComponent(ParametroProfesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
