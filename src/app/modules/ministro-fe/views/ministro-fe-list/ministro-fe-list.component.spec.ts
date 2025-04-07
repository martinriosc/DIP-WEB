import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistroFeListComponent } from './ministro-fe-list.component';

describe('MinistroFeListComponent', () => {
  let component: MinistroFeListComponent;
  let fixture: ComponentFixture<MinistroFeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistroFeListComponent]
    });
    fixture = TestBed.createComponent(MinistroFeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
