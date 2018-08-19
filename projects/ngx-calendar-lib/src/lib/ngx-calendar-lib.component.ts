import { Component, OnInit, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { Cell, Event, DisplayedEvent } from './ngx-calendar-lib.interfaces';
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

  private _displayedEvents: DisplayedEvent[] = [];

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
      console.log(this._displayedEvents);
    });
  }


  private _generateEvents(): void{
    this._clearDisplayedEvents();
    for (const item of Object.keys(this._events)) {
      if (isBefore(this._events[item].startDate, this._events[item].endDate)) {
        let events = [];
        let eventStartDate = this._events[item].startDate;
        for (let i = 0; i <= this._eventLenght(this._events[item]); i++) {
          if(isSunday(addDays(this._events[item].startDate, i)) && (format(addDays(this._events[item].startDate, i), 'YYYY-MM-DD') !== format(this._events[item].endDate, 'YYYY-MM-DD'))){
            events.push({id: this._events[item].id, title: this._events[item].title, startDate: eventStartDate, endDate: addDays(this._events[item].startDate, i), color: this._events[item].color})
            eventStartDate = addDays(this._events[item].startDate, i + 1);
          }
        }
        events.push({id: this._events[item].id, title: this._events[item].title, startDate: eventStartDate, endDate: this._events[item].endDate, color: this._events[item].color})
        this._displayedEvents.push(...events);
      }else if(isEqual(this._events[item].startDate, this._events[item].endDate)){
        this._displayedEvents.push({id: this._events[item].id, title: this._events[item].title, startDate: this._events[item].startDate, endDate: this._events[item].endDate, color: this._events[item].color});
      }
    }
    this._renderEvents();
  }

  private _renderEvents(): void{
    const firstCellDate = this._getFirstCellDate();
    for (const item of this._displayedEvents) {
      if(this._ifEventInMonth(item)){
        if (isBefore(item.startDate, item.endDate)) {
          const row = this._getRow(item);
          this._fillCellPlaceholder(item, row);
        } else if (this._isEventOneDay(item)) {
          const cell = this._cells[Math.abs(differenceInDays(parse(item.startDate), firstCellDate))];
          cell.push(cell.firstFreeRow, item.title, 1, item.color);
        }
      }
    }
  }

  private _changeMonth():void {
    this._clearCells();
    let rows = this._getRowsInMonth();
    this._createCells(rows);
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

  public nextMonth():void {
    this.date = addMonths(this.date, 1);
  }

  public prevMonth():void {
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

  private _getFirstCellDate(): Date {
    if (isSunday(getDay(lastDayOfMonth(subMonths(this.date, 1))))) {
      return startOfMonth(this.date);
    }

    return addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);
  }

  private _getRow(item: DisplayedEvent): number{
    const firstCellDate = this._getFirstCellDate();
    let rows = [];
    for (let i = 0; i <= this._eventLenght(item); i++) {
      const cell = this._cells[Math.abs(differenceInDays(addDays(parse(item.startDate), i), firstCellDate))];
      rows.push(cell.firstFreeRow);
    }
    return Math.max(...rows);
  }

  private _fillCellPlaceholder(item: DisplayedEvent, row: number): void {
    const firstCellDate = this._getFirstCellDate();
    for (let i = 0; i <= this._eventLenght(item); i++) {
      const cell = this._cells[Math.abs(differenceInDays(addDays(parse(item.startDate), i), firstCellDate))];
      if (i === 0) {
        cell.push(row, item.title, this._eventLenght(item)   + 1, item.color);
      } else {
        cell.push(row, '', 0, '');
      }
    }
  }

  private _ifEventInMonth(item: DisplayedEvent): boolean {
    const firstCellDate = this._getFirstCellDate();
    return isAfter(item.startDate, subDays(firstCellDate, 1)) && isBefore(item.endDate, addDays(endOfWeek(endOfMonth(this.date)), 1))
  }

  private _clearDisplayedEvents(): void {
    this._displayedEvents = [];
  }

  private _createCells(rows: number): void {
    const firstCellDate = this._getFirstCellDate();
    for (let i = 0; i < 7 * rows; i++) {
      this._cells.push(new Cell(getDate(addDays(firstCellDate, i)), isToday(addDays(firstCellDate, i)), addDays(firstCellDate, i)));
    };
  }

  private _clearCells(): void {
    this._cells = [];
  }

  private _getRowsInMonth(): number {
    if ((getDay(startOfMonth(this.date)) === 0 && getDaysInMonth(this.date) >= 30) || (getDay(startOfMonth(this.date)) === 6 && getDaysInMonth(this.date) === 31)) {
      return 6;
    }
    return 5;
  }

  private _isEventOneDay(item: DisplayedEvent): boolean {
    return isEqual(format(item.startDate, 'YYYY-MM-DD'), format(item.endDate, 'YYYY-MM-DD'));
  }

  private _eventLenght(item: DisplayedEvent): number {
    return Math.abs(differenceInDays(item.startDate, item.endDate));
  }
}
