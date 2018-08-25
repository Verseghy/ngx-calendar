export class Event {
  private _id: number;
  private _title: string;
  private _description?: string;
  private _startDate: Date;
  private _endDate?: Date;
  private _color?: string;

  constructor(id: number, title: string, description: string, startDate: Date, endDate: Date, color: string) {
    this._id = id;
    this._title = title;
    this._description = description || '';
    this._startDate = startDate;
    this._endDate = endDate || startDate;
    this._color = color || '#ffdd00';
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get startDate() {
    return this._startDate;
  }
  get endDate() {
    return this._endDate;
  }
  get color() {
    return this._color;
  }
}
