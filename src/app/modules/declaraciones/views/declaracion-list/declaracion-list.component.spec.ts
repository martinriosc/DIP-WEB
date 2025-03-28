import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionListComponent } from './declaracion-list.component';

describe('DeclaracionListComponent', () => {
  let component: DeclaracionListComponent;
  let fixture: ComponentFixture<DeclaracionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionListComponent]
    });
    fixture = TestBed.createComponent(DeclaracionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
