import { Component, OnInit, ViewChildren, AfterViewInit, ViewChild, Input, QueryList, ElementRef, HostListener } from '@angular/core';
import { DisplayedEvent, Settings } from './ngx-calendar-lib.interfaces';
import { Event } from './lib/event';
import { Cell } from './lib/cell';
import {
  subMonths, addMonths, format,
  isBefore, isAfter, isEqual,
  differenceInDays,
  getMonth,
  getDay,
  isSunday,
  startOfMonth,
  getDaysInMonth,
  isSaturday,
  addWeeks,
  startOfWeek,
  addDays,
  getDate,
  getISOWeek
} from 'date-fns';
import { Renderer } from './lib/renderer';
import { BehaviorSubject } from 'rxjs';

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

  public moreEventsPopupVisible = false;
  public moreEventsPopupTop: number;
  public moreEventsPopupLeft: number;
  public moreEventsPopupDay: string;
  public moreEventsPopupDate: number;
  public moreEventsPopupEvents;

  public monthChange$ = new BehaviorSubject<any>({
    year: this.date.getFullYear(),
    month: this.date.getMonth()
  });

  constructor(private _el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._renderer.HostElementRef = this._el;
      this._renderer.settings = this.settings;
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
    this.monthChange$.next({
      year: this.date.getFullYear(),
      month: this.date.getMonth()
    });
    this.moreEventsPopupVisible = false;
  }

  get date() {
    return this._date;
  }

  get formatedDate() {
    return format(this.date, 'YYYY. ') + this.settings.monthNames[getMonth(this.date)];
  }

  get shortDayNames() {
    return this.settings.shortDayNames;
  }

  get today() {
    return this.settings.today;
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
  private _clearDisplayedEvents(): void {
    this._displayedEvents = [];
  }

  private _eventLenght(item: DisplayedEvent): number {
    return Math.abs(differenceInDays(item.startDate, item.endDate));
  }

  get settings(): Settings {
    this._settings = this._settings || {};
    this._settings.shortDayNames = this._settings.shortDayNames || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    this._settings.shortMonthNames = this._settings.shortMonthNames ||
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this._settings.monthNames = this._settings.monthNames ||
      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this._settings.today = this._settings.today || 'Today';
    this._settings.moreEvent = this._settings.moreEvent || '{count} more';
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

  @HostListener('window:resize')
  public resize(): void {
    this.moreEventsPopupVisible = false;
    this._renderer.resize();
  }

  private _getdisplayedEvents(events) {
    const displayedEvents = [];
    for (const item of this._events) {
      for (const event of events) {
        if (item.id === event.id) {
          displayedEvents.push({id: item.id, title: item.title, color: item.color, order: event.order });
        }
      }
    }
    displayedEvents.sort((a, b) => {
      return a.order - b.order;
    });
    return displayedEvents;
  }

  public trackBy1(index, item) {
    return item.id;
  }

  public trackBy2(index, item) {
    return item.id;
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

  private _getWeekOfMonth(date: Date): number {
    return getISOWeek(date) - getISOWeek(startOfMonth(date));
  }

  public setMoreEventsPopup(date: Date, events: number[]): void {
    const height = ((this._el.nativeElement.offsetHeight - 68) / this._getRowsInMonth());
    let column = getDay(date);
    if (column === 0) {
      column = 7;
    }
    const row = this._getWeekOfMonth(date);
    this.moreEventsPopupVisible = true;
    this.moreEventsPopupTop = row * height - 50;
    this.moreEventsPopupLeft = ((column - 1) * (this._el.nativeElement.offsetWidth / 7)) - 24;
    this.moreEventsPopupDay = this.settings.shortDayNames[column - 1];
    this.moreEventsPopupDate = getDate(date);
    this.moreEventsPopupEvents = this._getdisplayedEvents(events);
  }
}
