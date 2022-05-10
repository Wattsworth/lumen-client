import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventstreamComponent } from './edit-eventstream.component';

describe('EditEventstreamComponent', () => {
  let component: EditEventstreamComponent;
  let fixture: ComponentFixture<EditEventstreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventstreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventstreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
