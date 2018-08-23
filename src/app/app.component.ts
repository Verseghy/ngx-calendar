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
    const colors = ['#d50000', '#f4511e', '#0b8043', '#039be5', '#3f51b5', '#8e24aa', '#616161'];
    const array = [];
    for (let i = 0; i < 20; i++) {
      const startday = addDays(new Date(), Math.floor(Math.random() * 60) - 30);
      const endday = addDays(startday,  Math.floor(Math.random() * 3));
      const color = colors[Math.floor(Math.random() * colors.length)];
      array.push(new Event(i, 'Event' + i, 'description', startday, endday, color));
    }
    this.calendar.setEvents(array);
  }

}
