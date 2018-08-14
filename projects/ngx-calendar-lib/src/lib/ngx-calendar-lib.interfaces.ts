import { ElementRef } from "@angular/core";

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
}

export class Cell {
    private _rows: {
        id: number;
        free: boolean;
    }[];
    private _date: number;

    constructor(date: number) {
        this._date = date;
    }

    get firstFreeRow(): number {
        for (const item of this._rows) {
            if (item.free) {
                return item.id;
            }
        }
        return 0;
    }

    set row(n: number) {
        if (this._rows[n]) {
            this._rows[n].free = false;
        } else {
            for (const _ of Array(n - this._rows.length + 1)) {
                this._rows.push({
                    id: this._rows.length,
                    free: true
                });
            }
            this._rows[n].free = false;
        }
    }

    get date(): number {
        return this._date;
    }
}
