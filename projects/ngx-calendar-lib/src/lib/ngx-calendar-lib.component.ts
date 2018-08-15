import { Component, OnInit, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { Cell } from './ngx-calendar-lib.interfaces';
import { getDay, lastDayOfMonth, startOfWeek, addDays, subMonths, startOfMonth, getDate, addMonths, getDaysInMonth, format, isToday, parse, getMonth, isBefore, isAfter, isEqual, differenceInDays, isSunday, endOfMonth, endOfWeek, subDays } from 'date-fns';

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar-lib.component.html',
  styleUrls: ['./ngx-calendar-lib.component.css']
})
export class NgxCalendarLibComponent implements OnInit, AfterViewInit {

  private _cells: Cell[] = [];
  private _date = new Date(2018, 7, 1);

  public events = [
    /*{ "id":"0", "dateFrom": "2018-07-30", dateTo: "2018-07-30", "color": "#7986cb", "title": "asd" },
    { "id":"1", "dateFrom": "2018-07-24", dateTo: "2018-08-2", "color": "#33b679", "title": "asd" },
    { "id":"2", "dateFrom": "2018-08-01", dateTo: "2018-08-21", "color": "#33b679", "title": "asd" },
    { "id":"3", "dateFrom": "2018-08-01", dateTo: "2018-08-02", "color": "#3f51b5", "title": "asd2" },
    { "id":"4", "dateFrom": "2018-08-05", dateTo: "2018-08-05", "color": "#7986cb", "title": "asd" },
    { "id":"5", "dateFrom": "2018-08-08", dateTo: "2018-08-08", "color": "#039be5", "title": "asd" },
    { "id":"6", "dateFrom": "2018-08-14", dateTo: "2018-08-17", "color": "#d50000", "title": "asd" },
    { "id":"7", "dateFrom": "2018-08-21", dateTo: "2018-08-21", "color": "#3f51b5", "title": "asd" },
    { "id":"8", "dateFrom": "2018-08-27", dateTo: "2018-08-28", "color": "#039be5", "title": "asd" },
    { "id":"9", "dateFrom": "2018-08-28", dateTo: "2018-08-28", "color": "#7986cb", "title": "asd" },
    { "id":"10", "dateFrom": "2018-08-30", dateTo: "2018-09-24", "color": "#7986cb", "title": "asd" },
    { "id":"11", "dateFrom": "2018-07-30", dateTo: "2018-09-2", "color": "#7986cb", "title": "asdasd" }*/
    { "id":"11", "dateFrom": "2018-07-30", dateTo: "2018-09-2", "color": "#7986cb", "title": "asdasd" }
  ]

  private _events = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._generateEvents();
    setTimeout(() => {
      this._changeMonth();
    })
  }


  private _generateEvents(){
    for (const item of Object.keys(this.events)) {
      if (isBefore(this.events[item].dateFrom, this.events[item].dateTo)) {
        let events = [];
        let start = this.events[item].dateFrom;
        for (let i = 0; i <= Math.abs(differenceInDays(this.events[item].dateFrom, this.events[item].dateTo)); i++) {
          if(isSunday(addDays(this.events[item].dateFrom, i))){
            events.push({id: this.events[item].id, dateFrom: start, dateTo: format(addDays(this.events[item].dateFrom, i), 'YYYY-MM-DD'), color: this.events[item].color, title: this.events[item].title})
            start = format(addDays(this.events[item].dateFrom, i + 1), 'YYYY-MM-DD');
          }
        }
        events.push({id: this.events[item].id, dateFrom: start, dateTo: this.events[item].dateTo, color: this.events[item].color, title: this.events[item].title})
        this._events.push(...events);
      }else if(isEqual(this.events[item].dateFrom, this.events[item].dateTo)){
        this._events.push(this.events[item]);
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

    for (let index = 0; index < 7 * rows; index++) {
      this._cells.push(new Cell(getDate(addDays(firstDay, index)), isToday(addDays(firstDay, index)), addDays(firstDay, index)));
    };

    for (const item of this._events) {
      if(isAfter(item.dateFrom, subDays(firstDay, 1)) && isBefore(item.dateTo, addDays(endOfWeek(endOfMonth(this.date)), 1))){
        if (isBefore(item.dateFrom, item.dateTo)) {
          let rows = [];
          for (let i = 0; i <= Math.abs(differenceInDays(item.dateFrom, item.dateTo)); i++) {
            const cell = this.cells[Math.abs(differenceInDays(addDays(parse(item.dateFrom), 1), firstDay))];
            rows.push(cell.firstFreeRow);
          }
          let row = Math.max(...rows);
          for (let i = 0; i <= Math.abs(differenceInDays(item.dateFrom, item.dateTo)); i++) {
            const cell = this.cells[Math.abs(differenceInDays(addDays(parse(item.dateFrom), i), firstDay))];
            if (i === 0) {
              cell.push(row, item.title, Math.abs(differenceInDays(item.dateFrom, item.dateTo)) + 1, item.color);
            } else {
              cell.push(row, '', 0, '');
            }
          }
        } else if (isEqual(item.dateFrom, item.dateTo)) {
          let cell = this.cells[Math.abs(differenceInDays(parse(item.dateFrom), firstDay))];
          cell.push(cell.firstFreeRow, item.title, 1, item.color);
        }
      }
    }

  }

  get date() {
    return this._date;
  }

  get formatedDate() {
    return format(this.date, 'YYYY MMMM');
  }

  set date(date: Date) {
    this._date = date;
    this._changeMonth();
  }

  get cells() {
    return this._cells;
  }

  public nextMonth() {
    this.date = addMonths(this.date, 1);
  }

  public prevMonth() {
    this.date = subMonths(this.date, 1);
  }

}
