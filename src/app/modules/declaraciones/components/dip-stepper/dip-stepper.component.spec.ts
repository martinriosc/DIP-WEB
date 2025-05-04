import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipStepperComponent } from './dip-stepper.component';

describe('DipStepperComponent', () => {
  let component: DipStepperComponent;
  let fixture: ComponentFixture<DipStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DipStepperComponent]
    });
    fixture = TestBed.createComponent(DipStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
