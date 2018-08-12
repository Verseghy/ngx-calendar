import { TestBed, inject } from '@angular/core/testing';

import { NgxCalendarLibService } from './ngx-calendar-lib.service';

describe('NgxCalendarLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxCalendarLibService]
    });
  });

  it('should be created', inject([NgxCalendarLibService], (service: NgxCalendarLibService) => {
    expect(service).toBeTruthy();
  }));
});
