import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextosComponent } from './textos.component';

describe('TextosComponent', () => {
  let component: TextosComponent;
  let fixture: ComponentFixture<TextosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextosComponent]
    });
    fixture = TestBed.createComponent(TextosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
