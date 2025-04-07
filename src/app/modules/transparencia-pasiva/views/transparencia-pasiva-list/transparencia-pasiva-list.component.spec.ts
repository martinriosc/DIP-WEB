import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaPasivaListComponent } from './transparencia-pasiva-list.component';

describe('TransparenciaPasivaListComponent', () => {
  let component: TransparenciaPasivaListComponent;
  let fixture: ComponentFixture<TransparenciaPasivaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparenciaPasivaListComponent]
    });
    fixture = TestBed.createComponent(TransparenciaPasivaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
