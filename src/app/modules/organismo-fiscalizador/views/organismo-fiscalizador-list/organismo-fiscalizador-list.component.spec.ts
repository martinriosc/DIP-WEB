import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismoFiscalizadorListComponent } from './organismo-fiscalizador-list.component';

describe('OrganismoFiscalizadorListComponent', () => {
  let component: OrganismoFiscalizadorListComponent;
  let fixture: ComponentFixture<OrganismoFiscalizadorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganismoFiscalizadorListComponent]
    });
    fixture = TestBed.createComponent(OrganismoFiscalizadorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
