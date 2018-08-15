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
        title: string;
        width: number;
        color: string;
    }[] = [];
    private _day: number;
    private _date: Date;
    private _today: boolean;

    constructor(day: number, today: boolean, date: Date) {
        this._day = day;
        this._today = today;
        this._date = date;
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

    get events(){
        let events = [];
        for(const item of Object.keys(this._rows)){
            if(!this._rows[item].free && this._rows[item].title !== ''){
                let top = Number(item) * 24;
                let width = 'calc(' + this._rows[item].width*100 + '% + ' + (this._rows[item].width - 5) + 'px)';
                events.push({title:this._rows[item].title, top: top, width: width, color: this._rows[item].color});
            }
        }
        return events;
    }

    public push(row: number, title: string, width: number, color: string){
        if (this._rows[row]) {
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
            this._rows[row].free = false;
            this._rows[row].title = title;
            this._rows[row].width = width;
            this._rows[row].color = color;
        }
    }
}
