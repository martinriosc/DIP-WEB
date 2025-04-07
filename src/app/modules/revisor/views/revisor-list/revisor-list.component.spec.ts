import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisorListComponent } from './revisor-list.component';

describe('RevisorListComponent', () => {
  let component: RevisorListComponent;
  let fixture: ComponentFixture<RevisorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisorListComponent]
    });
    fixture = TestBed.createComponent(RevisorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
