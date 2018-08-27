export class Cell {
  private _rows: {
    id: number;
    free: boolean;
    title: string;
    width: number;
    color: string;
  }[] = [];
  private _day: number;
  private _date: Date;
  private _today: boolean;
  private _maxRows = 1;

  constructor(day: number, today: boolean, date: Date) {
    this._day = day;
    this._today = today;
    this._date = date;
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
        return item.id;
      }
    }
    return this._rows.length;
  }

  get day(): number {
    return this._day;
  }

  get today(): boolean {
    return this._today;
  }

  get date(): Date {
    return this._date;
  }

  get events() {
    const events = [];
    for (const item of Object.keys(this._rows)) {
      if (!this._rows[item].free && this._rows[item].title !== '') {
        const top = Number(item) * 24 + 'px';
        const width = 'calc(' + this._rows[item].width * 100 + '% + ' + (this._rows[item].width - 5) + 'px)';
        events.push({ title: this._rows[item].title, top: top, width: width, color: this._rows[item].color });
      }
    }
    return events;
  }

  get renderedEvents() {
    const events = [];
    for (const item of Object.keys(this._rows)) {
      if (!this._rows[item].free && this._rows[item].title !== '' && this._rows[item].id < this._maxRows) {
        const top = Number(item) * 24 + 'px';
        const width = 'calc(' + this._rows[item].width * 100 + '% + ' + (this._rows[item].width - 5) + 'px)';
        events.push({ title: this._rows[item].title, top: top, width: width, color: this._rows[item].color });
      }
    }
    return events;
  }

  set maxRows(rows: number) {
    this._maxRows = rows;
  }

  public push(row: number, title: string, width: number, color: string) {
    if (this._rows[row]) {
      this._rows[row].id = row;
      this._rows[row].free = false;
      this._rows[row].title = title;
      this._rows[row].width = width;
      this._rows[row].color = color;
    } else {
      for (const _ of Array(row - this._rows.length + 1)) {
        this._rows.push({
          id: this._rows.length,
          free: true,
          title: '',
          width: 0,
          color: ''
        });
      }
      this._rows[row].id = row;
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
