import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso10ValoresComponent } from './paso-10-valores.component';

describe('Paso10ValoresComponent', () => {
  let component: Paso10ValoresComponent;
  let fixture: ComponentFixture<Paso10ValoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso10ValoresComponent]
    });
    fixture = TestBed.createComponent(Paso10ValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
