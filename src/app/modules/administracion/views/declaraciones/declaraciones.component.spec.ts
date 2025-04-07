import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionesComponent } from './declaraciones.component';

describe('DeclaracionesComponent', () => {
  let component: DeclaracionesComponent;
  let fixture: ComponentFixture<DeclaracionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionesComponent]
    });
    fixture = TestBed.createComponent(DeclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
