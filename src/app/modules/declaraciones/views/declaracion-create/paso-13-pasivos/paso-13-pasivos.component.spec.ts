import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso13PasivosComponent } from './paso-13-pasivos.component';

describe('Paso13PasivosComponent', () => {
  let component: Paso13PasivosComponent;
  let fixture: ComponentFixture<Paso13PasivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso13PasivosComponent]
    });
    fixture = TestBed.createComponent(Paso13PasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
