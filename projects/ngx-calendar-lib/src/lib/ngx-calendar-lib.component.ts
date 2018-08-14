import {Component, OnInit, ViewChildren, AfterViewInit, ViewChild} from '@angular/core';
import { Cell } from './ngx-calendar-lib.interfaces';
import { getDay, lastDayOfMonth, startOfWeek, addDays, subMonths, startOfMonth, getDate, addMonths, getDaysInMonth, format, isToday, parse, getMonth } from 'date-fns';

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar-lib.component.html',
  styleUrls: ['./ngx-calendar-lib.component.css']
})
export class NgxCalendarLibComponent implements OnInit, AfterViewInit {

  private _cells: Cell[] = [];
  private _date = new Date(2018, 7, 1);

  public events = [
    {"date":"2018-08-1","title":"asd"},
    {"date":"2018-08-1","title":"asd2"},
    {"date":"2018-08-5","title":"asd"},
    {"date":"2018-08-8","title":"asd"},
    {"date":"2018-08-14","title":"asd"},
    {"date":"2018-08-21","title":"asd"},
    {"date":"2018-08-27","title":"asd"},
    {"date":"2018-08-28","title":"asd"},
    {"date":"2018-08-30","title":"asd"}
  ]

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._changeMonth();
      console.log(this.cells);
    })
  }

  private _changeMonth() {
    let rows = 5;
    this._cells = [];
    let firstDay = addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);
    let prevMonth = getDaysInMonth(subMonths(this.date, 1)) - getDate(firstDay);

    if(getDay(lastDayOfMonth(subMonths(this.date, 1))) === 0){
      firstDay = startOfMonth(this.date);
      prevMonth = 0;
    }

    if((getDay(startOfMonth(this.date)) === 0 && getDaysInMonth(this.date) >= 30) || (getDay(startOfMonth(this.date)) === 6 && getDaysInMonth(this.date) === 31)){
      rows = 6;
    }

    for(let index = 0;index < 7 * rows; index++){
      this._cells.push(new Cell(getDate(firstDay), isToday(firstDay), firstDay));
      firstDay = addDays(firstDay, 1);
    };

    for(const item of this.events){
      if(getMonth(parse(item.date)) == getMonth(this.date)){
        let cell = this.cells[getDate(parse(item.date)) + prevMonth];
        cell.push(cell.firstFreeRow, item.title);
        console.log(cell.events);
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
