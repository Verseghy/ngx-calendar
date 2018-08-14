import {Component, OnInit, ViewChildren, AfterViewInit} from '@angular/core';
import { Event, Cell } from './ngx-calendar-lib.interfaces';
import { getDay, lastDayOfMonth, startOfWeek, addDays, subMonths, startOfMonth, getDate, addMonths } from 'date-fns';
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
    this._changeMonth();
    console.log(this._cells);
  }

  private _changeMonth() {
    this._cells = [];
    let firstDay = addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);
    if(getDay(lastDayOfMonth(subMonths(this.date, 1))) === 0){
      firstDay = startOfMonth(this.date);
    }
    for(let index = 0;index < 42; index++){
      this._cells.push(new Cell(getDate(firstDay)));
      firstDay = addDays(firstDay, 1);
    };
  }

  get date() {
    return this._date;
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
