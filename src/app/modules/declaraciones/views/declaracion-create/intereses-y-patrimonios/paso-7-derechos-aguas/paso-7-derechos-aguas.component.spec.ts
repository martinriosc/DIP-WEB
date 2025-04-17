import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso7DerechosAguasComponent } from './paso-7-derechos-aguas.component';

describe('Paso7DerechosAguasComponent', () => {
  let component: Paso7DerechosAguasComponent;
  let fixture: ComponentFixture<Paso7DerechosAguasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso7DerechosAguasComponent]
    });
    fixture = TestBed.createComponent(Paso7DerechosAguasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
