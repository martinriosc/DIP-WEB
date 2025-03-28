import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso4TutelaComponent } from './paso-4-tutela.component';

describe('Paso4TutelaComponent', () => {
  let component: Paso4TutelaComponent;
  let fixture: ComponentFixture<Paso4TutelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso4TutelaComponent]
    });
    fixture = TestBed.createComponent(Paso4TutelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
