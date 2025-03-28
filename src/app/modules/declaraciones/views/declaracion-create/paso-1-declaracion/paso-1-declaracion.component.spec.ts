import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso1DeclaracionComponent } from './paso-1-declaracion.component';

describe('Paso1DeclaracionComponent', () => {
  let component: Paso1DeclaracionComponent;
  let fixture: ComponentFixture<Paso1DeclaracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso1DeclaracionComponent]
    });
    fixture = TestBed.createComponent(Paso1DeclaracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
