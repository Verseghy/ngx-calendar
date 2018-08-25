import { DisplayedEvent } from '../ngx-calendar-lib.interfaces';
import {
  addDays, startOfWeek, lastDayOfMonth,
  subMonths, startOfMonth, getDay,
  isSunday, isAfter, subDays,
  isBefore, endOfWeek, endOfMonth, getDate, isToday, differenceInDays, parse, format, isEqual, getDaysInMonth, isSaturday
} from 'date-fns';
import { Cell } from './cell';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';

export class Renderer {
  private _date = new Date();
  private _cells: Cell[] = [];
  private _events: DisplayedEvent[] = [];
  public HostElementRef: ElementRef;

  public renderEvents(): void {
    const firstCellDate = this._getFirstCellDate();
    for (const i of Object.keys(this._events)) {
      const item = this._events[i];
      const asd = [];
      if (isBefore(item.startDate, item.endDate)) {

        let eventStartDate = item.startDate;
        for (let i2 = 0; i2 < this._eventLenght(item); i2++) {
          if (
            isSunday(addDays(item.startDate, i2)) &&
            (format(addDays(item.startDate, i2), 'YYYY-MM-DD') !==
              format(item.endDate, 'YYYY-MM-DD'))) {
            asd.push({
              id: item.id,
              title: item.title,
              startDate: eventStartDate,
              endDate: addDays(item.startDate, i2),
              color: item.color
            });
            eventStartDate = addDays(item.startDate, i2 + 1);
          }
        }
        asd.push({
          id: item.id,
          title: item.title,
          startDate: eventStartDate,
          endDate: item.endDate,
          color: item.color
        });
      } else if (isEqual(item.startDate, item.endDate)) {
        asd.push({
          id: item.id,
          title: item.title,
          startDate: item.startDate,
          endDate: item.endDate,
          color: item.color
        });
      }
      for (const item2 of asd) {
        if (this._isEventInMonth(item2)) {
          const row = this._cells[Math.abs(differenceInDays(item2.startDate, firstCellDate))].firstFreeRow;
          this._fillCellPlaceholder(item2, row);
        }
      }
    }
  }

  public changeMonth(date: Date): void {
    this._date = date;
    this._generateCells(this._getRowsInMonth());
    this.renderEvents();
    this._getMaxVisibleRows();
  }

  public setEvents(events: DisplayedEvent[]): void {
    this._events = events;
  }

  public getCells(): Cell[] {
    return this._cells;
  }

  private _generateCells(rows: number): Cell[] {
    this._clearCells();
    const firstCellDate = this._getFirstCellDate();
    for (let i = 0; i < 7 * rows; i++) {
      this._cells.push(new Cell(getDate(addDays(firstCellDate, i)), isToday(addDays(firstCellDate, i)), addDays(firstCellDate, i)));
    }
    return this._cells;
  }

  private _getFirstCellDate(): Date {
    if (isSunday(lastDayOfMonth(subMonths(this._date, 1)))) {
      return startOfMonth(this._date);
    }

    return addDays(startOfWeek(lastDayOfMonth(subMonths(this._date, 1))), 1);
  }

  private _getLastCellDate(): Date {
    if (isSunday(endOfMonth(this._date))) {
      return endOfMonth(this._date);
    }

    return addDays(endOfWeek(endOfMonth(this._date)), 1);
  }

  private _isEventInMonth(item: DisplayedEvent): boolean {
    const firstCellDate = this._getFirstCellDate();
    const lastCellDate = this._getLastCellDate();
    return isAfter(format(item.startDate, 'YYYY-MM-DD'), format(subDays(firstCellDate, 1), 'YYYY-MM-DD')) &&
      isBefore(format(item.endDate, 'YYYY-MM-DD'), format(lastCellDate, 'YYYY-MM-DD'));
  }

  private _fillCellPlaceholder(item: DisplayedEvent, row: number): void {
    const firstCellDate = this._getFirstCellDate();
    for (let i = 0; i < this._eventLenght(item); i++) {
      const cell = this._cells[Math.abs(differenceInDays(addDays(parse(item.startDate), i), firstCellDate))];
      if (i === 0) {
        cell.push(row, item.title, this._eventLenght(item), item.color);
      } else {
        cell.push(row, '', 0, '');
      }
    }
  }

  private _eventLenght(item: DisplayedEvent): number {
    return Math.abs(differenceInDays(item.startDate, item.endDate)) + 1;
  }

  private _clearCells(): void {
    this._cells = [];
  }

  private _getRowsInMonth(): number {
    if (
      (isSunday(startOfMonth(this._date)) && getDaysInMonth(this._date) >= 30) ||
      (isSaturday(startOfMonth(this._date)) && getDaysInMonth(this._date) === 31)
    ) {
      return 6;
    }
    return 5;
  }

  private _getMaxVisibleRows(): number {
    console.log((this.HostElementRef.nativeElement.offsetHeight - 68) / this._getRowsInMonth());
    return 0;
  }
}
