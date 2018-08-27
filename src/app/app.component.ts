import { Component, ViewChild, OnInit } from '@angular/core';
import { NgxCalendarLibComponent } from '../../projects/ngx-calendar-lib/src/lib/ngx-calendar-lib.component';
import { Settings } from '../../projects/ngx-calendar-lib/src/lib/ngx-calendar-lib.interfaces';
import { addDays, parse } from 'date-fns';
import { Event } from 'projects/ngx-calendar-lib/src/lib/lib/event';

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
    const colors = [
      '#ad1457', '#d81b60', '#d50000', '#e67c73',
      '#f4511e', '#ef6c00', '#f09300', '#f6bf26',
      '#e4c441', '#c0ca33', '#7cb342', '#33b679',
      '#0b8043', '#009688', '#039be5', '#4285f4',
      '#3f51b5', '#7986cb', '#b39ddb', '#9e69af',
      '#8e24aa', '#795548', '#616161', '#a79b8e',
    ];
    const array = [];
    for (let i = 0; i < 70; i++) {
      const startday = addDays(new Date(), Math.floor(Math.random() * 60) - 60);
      const endday = addDays(startday,  Math.floor(Math.random() * 3));
      const color = colors[Math.floor(Math.random() * colors.length)];
      array.push(new Event(i, 'Event' + i, 'description', startday, endday, color));
    }

    const array2 = [
      new Event(0, 'Event1', 'description', new Date(parse('2018-08-08')), new Date(parse('2018-08-10')), '#3f51b5'),
      new Event(1, 'Event2', 'description', new Date(parse('2018-08-07')), new Date(parse('2018-08-08')), '#3f51b5'),
      new Event(2, 'Event3', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-09')), '#3f51b5'),
      new Event(3, 'Event4', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-10')), '#0b8043'),
      new Event(4, 'Event5', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-09')), '#3f51b5'),
      new Event(5, 'Event6', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-09')), '#3f51b5'),
      new Event(6, 'Event7', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-09')), '#3f51b5'),
      new Event(7, 'Event8', 'description', new Date(parse('2018-08-09')), new Date(parse('2018-08-09')), '#3f51b5'),
    ];
    this.calendar.setEvents(array2);
  }

}
