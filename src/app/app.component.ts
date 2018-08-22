import { Component, ViewChild, OnInit } from '@angular/core';
import { NgxCalendarLibComponent } from '../../projects/ngx-calendar-lib/src/lib/ngx-calendar-lib.component';
import { Event, Settings } from '../../projects/ngx-calendar-lib/src/lib/ngx-calendar-lib.interfaces';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngx-calendar';
  settings: Settings = {
    shortDayNames: ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']
  };
  @ViewChild(NgxCalendarLibComponent) calendar;

  ngOnInit () {
    const asd = [];
    asd.push(new Event(0, 'asd1', 'asdasd', new Date(), addDays(new Date(), 0), '#0B8043'));
    asd.push(new Event(1, 'asd2', 'asdasd', new Date(), addDays(new Date(), 1), '#D50000'));
    this.calendar.setEvents(asd);
  }

}
