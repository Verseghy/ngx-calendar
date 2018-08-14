import {Component, OnInit, ViewChildren, AfterViewInit, ViewChild} from '@angular/core';
import { Event, Cell } from './ngx-calendar-lib.interfaces';
import { getDay, lastDayOfMonth, startOfWeek, addDays, subMonths, startOfMonth, getDate, addMonths, getDaysInMonth, format, isToday } from 'date-fns';
import { QueryList } from '@angular/core/src/render3';

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar-lib.component.html',
  styleUrls: ['./ngx-calendar-lib.component.css']
})
export class NgxCalendarLibComponent implements OnInit, AfterViewInit {

  private _cells: Cell[] = [];
  private _date = new Date(2018, 7, 1);

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._changeMonth();
    })
  }

  private _changeMonth() {
    let rows = 5;
    this._cells = [];
    let firstDay = addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);

    if(getDay(lastDayOfMonth(subMonths(this.date, 1))) === 0){
      firstDay = startOfMonth(this.date);
    }

    if((getDay(startOfMonth(this.date)) === 0 && getDaysInMonth(this.date) >= 30) || (getDay(startOfMonth(this.date)) === 6 && getDaysInMonth(this.date) === 31)){
      rows = 6;
    }

    for(let index = 0;index < 7 * rows; index++){
      this._cells.push(new Cell(getDate(firstDay), isToday(firstDay)));
      firstDay = addDays(firstDay, 1);
    };
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
