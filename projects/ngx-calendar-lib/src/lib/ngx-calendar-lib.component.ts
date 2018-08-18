import { Component, OnInit, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { Cell, Event } from './ngx-calendar-lib.interfaces';
import { getDay, lastDayOfMonth, startOfWeek, addDays, subMonths, startOfMonth, getDate, addMonths, getDaysInMonth, format, isToday, parse, getMonth, isBefore, isAfter, isEqual, differenceInDays, isSunday, endOfMonth, endOfWeek, subDays } from 'date-fns';

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar-lib.component.html',
  styleUrls: ['./ngx-calendar-lib.component.css']
})
export class NgxCalendarLibComponent implements OnInit, AfterViewInit {

  private _cells: Cell[] = [];
  private _date = new Date();

  private _events: Event[] = [];

  private _events2 = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._changeMonth();
      let asd = [];
      asd.push(new Event(0, 'asd1', 'asdasd', new Date(), addDays(new Date(), 0), '#0B8043'));
      asd.push(new Event(1, 'asd2', 'asdasd', new Date(), addDays(new Date(), 1), '#D50000'));
      this.setEvents(asd);
      console.log(this._events2);
    });
  }


  private _generateEvents(){
    this._events2 = [];
    for (const item of Object.keys(this._events)) {
      if (isBefore(this._events[item].startDate, this._events[item].endDate)) {
        let events = [];
        let eventStartDate = this._events[item].startDate;
        for (let i = 0; i <= Math.abs(differenceInDays(this._events[item].startDate, this._events[item].endDate)); i++) {
          if(isSunday(addDays(this._events[item].startDate, i)) && (format(addDays(this._events[item].startDate, i), 'YYYY-MM-DD') !== format(this._events[item].endDate, 'YYYY-MM-DD'))){
            events.push({id: this._events[item].id, title: this._events[item].title, startDate: eventStartDate, endDate: addDays(this._events[item].startDate, i), color: this._events[item].color})
            eventStartDate = addDays(this._events[item].startDate, i + 1);
          }
        } 
        events.push({id: this._events[item].id, title: this._events[item].title, startDate: eventStartDate, endDate: this._events[item].endDate, color: this._events[item].color})
        this._events2.push(...events);
      }else if(isEqual(this._events[item].startDate, this._events[item].endDate)){
        this._events2.push({id: this._events[item].id, title: this._events[item].title, startDate: this._events[item].startDate, endDate: this._events[item].endDate, color: this._events[item].color});
      }
    }
    this._renderEvents();
  }

  private _renderEvents(){
    let firstDay = addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);

    if (getDay(lastDayOfMonth(subMonths(this.date, 1))) === 0) {
      firstDay = startOfMonth(this.date);
    }

    for (const item of this._events2) {
      if(isAfter(item.startDate, subDays(firstDay, 1)) && isBefore(item.endDate, addDays(endOfWeek(endOfMonth(this.date)), 1))){
        if (isBefore(item.startDate, item.endDate)) {
          let rows = [];
          for (let i = 0; i <= Math.abs(differenceInDays(item.startDate, item.endDate)); i++) {
            const cell = this._cells[Math.abs(differenceInDays(addDays(parse(item.startDate), 1), firstDay))];
            rows.push(cell.firstFreeRow);
          }
          let row = Math.max(...rows);
          for (let i = 0; i <= Math.abs(differenceInDays(item.startDate, item.endDate)); i++) {
            const cell = this._cells[Math.abs(differenceInDays(addDays(parse(item.startDate), i), firstDay))];
            console.log(cell);
            if (i === 0) {
              cell.push(row, item.title, Math.abs(differenceInDays(item.startDate, item.endDate)) + 1, item.color);
            } else {
              cell.push(row, '', 0, '');
            }
          }
        } else if (isEqual(format(item.startDate, 'YYYY-MM-DD'), format(item.endDate, 'YYYY-MM-DD'))) {
          const cell = this._cells[Math.abs(differenceInDays(parse(item.startDate), firstDay))];
          cell.push(cell.firstFreeRow, item.title, 1, item.color);
        }
      }
    }
  }

  private _changeMonth() {
    let rows = 5;
    this._cells = [];
    let firstDay = addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);
    let prevMonth = getDaysInMonth(subMonths(this.date, 1)) - getDate(firstDay);

    if (getDay(lastDayOfMonth(subMonths(this.date, 1))) === 0) {
      firstDay = startOfMonth(this.date);
      prevMonth = 0;
    }

    if ((getDay(startOfMonth(this.date)) === 0 && getDaysInMonth(this.date) >= 30) || (getDay(startOfMonth(this.date)) === 6 && getDaysInMonth(this.date) === 31)) {
      rows = 6;
    }

    for (let i = 0; i < 7 * rows; i++) {
      this._cells.push(new Cell(getDate(addDays(firstDay, i)), isToday(addDays(firstDay, i)), addDays(firstDay, i)));
    };

    this._renderEvents();
  }

  get date() {
    return this._date;
  }

  get formatedDate() {
    return format(this.date, 'YYYY MMMM');
  }

  get cells() {
    return this._cells;
  }

  set date(date: Date) {
    this._date = date;
    this._changeMonth();
  }

  public nextMonth() {
    this.date = addMonths(this.date, 1);
  }

  public prevMonth() {
    this.date = subMonths(this.date, 1);
  }

  public setEvents(events: Array<Event>){
    this._events = events;
    this._generateEvents();
  }

  public addEvent(event: Event){
    this._events.push(event);
    this._generateEvents();
  }

}
