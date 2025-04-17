import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso8BienesMueblesComponent } from './paso-8-bienes-muebles.component';

describe('Paso8BienesMueblesComponent', () => {
  let component: Paso8BienesMueblesComponent;
  let fixture: ComponentFixture<Paso8BienesMueblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso8BienesMueblesComponent]
    });
    fixture = TestBed.createComponent(Paso8BienesMueblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
