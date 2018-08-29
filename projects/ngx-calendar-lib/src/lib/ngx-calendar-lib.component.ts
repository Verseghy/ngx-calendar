import { Component, OnInit, ViewChildren, AfterViewInit, ViewChild, Input, QueryList, ElementRef, HostListener } from '@angular/core';
import { DisplayedEvent, Settings } from './ngx-calendar-lib.interfaces';
import { Event } from 'projects/ngx-calendar-lib/src/lib/lib/event';
import { Cell } from 'projects/ngx-calendar-lib/src/lib/lib/cell';
import {
  getDay, lastDayOfMonth, startOfWeek,
  addDays, subMonths, startOfMonth,
  getDate, addMonths, getDaysInMonth,
  format, isToday, parse,
  isBefore, isAfter, isEqual,
  differenceInDays, isSunday, endOfMonth,
  endOfWeek, subDays, isSaturday
} from 'date-fns';
import { Renderer } from './lib/renderer';

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
  private _settings: Settings;
  private _renderer = new Renderer();

  public shortDayNames: string[];

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._renderer.HostElementRef = this.el;
      this.shortDayNames = this.settings.shortDayNames;
      this._changeMonth();
    });
  }


  private _generateEvents(): void {
    this._clearDisplayedEvents();
    for (const item of this._events) {
      this._displayedEvents.push({
        id: item.id,
        title: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        color: item.color
      });
    }
    this._sortDisplayedEvents();
    this._renderer.setEvents(this._displayedEvents);
  }

  private _sortDisplayedEvents() {
    let lastDay = this._displayedEvents[0].startDate;
    let eventsInDay = [];
    const sortedDisplayedEvents = [];
    for (const item of this._displayedEvents) {
      if (isAfter(item.startDate, lastDay)) {
        lastDay = item.startDate;
        sortedDisplayedEvents.push(...this._sortEventsInDay(eventsInDay));
        eventsInDay = [item];
      } else if (isEqual(item.startDate, lastDay)) {
        eventsInDay.push(item);
      }
    }
    sortedDisplayedEvents.push(...this._sortEventsInDay(eventsInDay));
    this._displayedEvents = sortedDisplayedEvents;
  }

  private _changeMonth(): void {
    this._renderer.changeMonth(this._date);
    this._cells = this._renderer.getCells();
  }

  get date() {
    return this._date;
  }

  get formatedDate() {
    return format(this.date, 'YYYY. MMMM');
  }

  get cells() {
    return this._cells;
  }

  set date(date: Date) {
    this._date = date;
    this._changeMonth();
  }

  public nextMonth(): void {
    this.date = addMonths(this.date, 1);
  }

  public prevMonth(): void {
    this.date = subMonths(this.date, 1);
  }

  public now(): void {
    this.date = new Date();
  }

  public setEvents(events: Array<Event>) {
    this._events = events;
    this._sortEventsArray();
    this._generateEvents();
  }

  public addEvent(event: Event) {
    this._events.push(event);
    this._sortEventsArray();
    this._generateEvents();
  }

  private _sortEventsArray(): void {
    this._events.sort((a, b) => {
      if (isAfter(a.startDate, b.startDate)) { return 1; }
      if (isBefore(a.startDate, b.startDate)) { return -1; }
      return 0;
    });
  }

  private _getFirstCellDate(): Date {
    if (isSunday(getDay(lastDayOfMonth(subMonths(this.date, 1))))) {
      return startOfMonth(this.date);
    }

    return addDays(startOfWeek(lastDayOfMonth(subMonths(this.date, 1))), 1);
  }

  private _clearDisplayedEvents(): void {
    this._displayedEvents = [];
  }

  private _eventLenght(item: DisplayedEvent): number {
    return Math.abs(differenceInDays(item.startDate, item.endDate));
  }

  get settings(): Settings {
    this._settings = this._settings || {};
    this._settings.shortDayNames = this._settings.shortDayNames || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return this._settings;
  }

  @Input('settings')
  set settings(settings: Settings) {
    this._settings = settings;
  }

  private _sortEventsInDay(events: DisplayedEvent[]): DisplayedEvent[] {
    return events.sort((a, b) => {
      return (this._eventLenght(a) - this._eventLenght(b)) * (-1);
    });
  }

  @HostListener('window:resize', ['$event'])
  public resize(): void {
    this._renderer.resize();
  }

  public getEvent(id: number): void {
    if (id !== null) {
      for (const item of this._events) {
        if (item.id === id) {
          console.log(item);
        }
      }
    }
  }

  public getMoreEvents(ids: number[]): void {
    if (ids) {
      const events = [];
      for (const item of this._events) {
        for (const id of ids) {
          if (item.id === id) {
            events.push(item);
          }
        }
      }
      console.log(events);
    }
  }
}
