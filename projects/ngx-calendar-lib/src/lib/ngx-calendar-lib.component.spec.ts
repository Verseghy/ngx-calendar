import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCalendarLibComponent } from './ngx-calendar-lib.component';

describe('NgxCalendarLibComponent', () => {
  let component: NgxCalendarLibComponent;
  let fixture: ComponentFixture<NgxCalendarLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxCalendarLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCalendarLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
