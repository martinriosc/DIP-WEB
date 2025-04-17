import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroUtmComponent } from './parametro-utm.component';

describe('ParametroUtmComponent', () => {
  let component: ParametroUtmComponent;
  let fixture: ComponentFixture<ParametroUtmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroUtmComponent]
    });
    fixture = TestBed.createComponent(ParametroUtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
