import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeServicioListComponent } from './jefe-servicio-list.component';

describe('JefeServicioListComponent', () => {
  let component: JefeServicioListComponent;
  let fixture: ComponentFixture<JefeServicioListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JefeServicioListComponent]
    });
    fixture = TestBed.createComponent(JefeServicioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 