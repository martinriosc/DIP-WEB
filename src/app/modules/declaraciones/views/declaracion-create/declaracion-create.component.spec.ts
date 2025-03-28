import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionCreateComponent } from './declaracion-create.component';

describe('DeclaracionCreateComponent', () => {
  let component: DeclaracionCreateComponent;
  let fixture: ComponentFixture<DeclaracionCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionCreateComponent]
    });
    fixture = TestBed.createComponent(DeclaracionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
