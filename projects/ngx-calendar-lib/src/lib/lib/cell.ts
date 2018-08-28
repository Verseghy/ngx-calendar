import { format, getDate } from 'date-fns';

export class Cell {
  private _rows: {
    id: number;
    row: number;
    free: boolean;
    title: string;
    width: number;
    color: string;
  }[] = [];
  private _day: number;
  private _date: Date;
  private _today: boolean;
  private _maxRows: number;

  constructor(day: number, today: boolean, date: Date, maxRows: number) {
    this._day = day;
    this._today = today;
    this._date = date;
    this._maxRows = maxRows;
  }

  public getRow(width: number): number {
    for (const item of Object.keys(this._rows)) {
      if (this._rows[item].width <= width) {
        return Number(item) + 1;
      }
    }
    return this._rows.length + 1;
  }

  get firstFreeRow(): number {
    for (const item of this._rows) {
      if (item.free) {
        return item.row;
      }
    }
    return this._rows.length;
  }

  get day(): string {
    if (getDate(this._date) === 1) {
      return format(this._date, 'MMM. D');
    }
    return format(this._date, 'D');
  }

  get today(): boolean {
    return this._today;
  }

  get date(): Date {
    return this._date;
  }

  get renderedEvents() {
    const events = [];
    let moreEvents = 0;
    for (const item of Object.keys(this._rows)) {
      let rows = 0;
      if (this._rows[item].length <= this._maxRows) {
        rows = this._maxRows;
      } else {
        rows = this._maxRows - 1;
      }
      rows = this._maxRows - 1;
      if (this._rows[item].row < rows) {
        if (this._rows[item].row < this._maxRows - 1) {
          if (!this._rows[item].free && this._rows[item].title !== '') {
            const top = Number(item) * 24 + 'px';
            const width = 'calc(' + this._rows[item].width * 100 + '% + ' + (this._rows[item].width - 5) + 'px)';
            events.push({ title: this._rows[item].title, top: top, width: width, color: this._rows[item].color });
          }
        }
      } else {
        if (!this._rows[item].free) {
          moreEvents++;
        }
      }
    }
    if (moreEvents !== 0) {
      const top2 = (this._maxRows - 1) * 24 + 'px';
      events.push({ title: moreEvents + ' további', top: top2, width: 'calc(100% - 1px)', color: 'transparent', more: true });
    }
    return events;
  }

  set maxRows(rows: number) {
    this._maxRows = rows;
  }

  public push(row: number, title: string, width: number, color: string) {
    if (this._rows[row]) {
      this._rows[row].id = 0;
      this._rows[row].row = row;
      this._rows[row].free = false;
      this._rows[row].title = title;
      this._rows[row].width = width;
      this._rows[row].color = color;
    } else {
      for (const _ of Array(row - this._rows.length + 1)) {
        this._rows.push({
          id: 0,
          row: this._rows.length,
          free: true,
          title: '',
          width: 0,
          color: ''
        });
      }
      this._rows[row].id = 0;
      this._rows[row].row = row;
      this._rows[row].free = false;
      this._rows[row].title = title;
      this._rows[row].width = width;
      this._rows[row].color = color;
    }
  }

  public getLastRow(): number {
    return this._rows.length;
  }
}
