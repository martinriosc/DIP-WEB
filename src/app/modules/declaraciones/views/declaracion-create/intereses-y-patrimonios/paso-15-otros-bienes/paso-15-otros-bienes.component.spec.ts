import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso15OtrosBienesComponent } from './paso-15-otros-bienes.component';

describe('Paso15OtrosBienesComponent', () => {
  let component: Paso15OtrosBienesComponent;
  let fixture: ComponentFixture<Paso15OtrosBienesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso15OtrosBienesComponent]
    });
    fixture = TestBed.createComponent(Paso15OtrosBienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
