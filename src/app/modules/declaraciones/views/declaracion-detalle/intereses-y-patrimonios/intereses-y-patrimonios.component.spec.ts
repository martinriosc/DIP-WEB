import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresesYPatrimoniosComponent } from './intereses-y-patrimonios.component';

describe('InteresesYPatrimoniosComponent', () => {
  let component: InteresesYPatrimoniosComponent;
  let fixture: ComponentFixture<InteresesYPatrimoniosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteresesYPatrimoniosComponent]
    });
    fixture = TestBed.createComponent(InteresesYPatrimoniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
