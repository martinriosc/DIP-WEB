import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso6BienesInmueblesComponent } from './paso-6-bienes-inmuebles.component';

describe('Paso6BienesInmueblesComponent', () => {
  let component: Paso6BienesInmueblesComponent;
  let fixture: ComponentFixture<Paso6BienesInmueblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso6BienesInmueblesComponent]
    });
    fixture = TestBed.createComponent(Paso6BienesInmueblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
