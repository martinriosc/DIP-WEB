import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaActivaComponent } from './transparencia-activa.component';

describe('TransparenciaActivaComponent', () => {
  let component: TransparenciaActivaComponent;
  let fixture: ComponentFixture<TransparenciaActivaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaActivaComponent]
    });
    fixture = TestBed.createComponent(TransparenciaActivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
