import {Component, OnInit, ViewChildren, AfterViewInit} from '@angular/core';
import { Event, Cell } from './ngx-calendar-lib.interfaces';

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar-lib.component.html',
  styleUrls: ['./ngx-calendar-lib.component.css']
})
export class NgxCalendarLibComponent implements OnInit, AfterViewInit {

  @ViewChildren('cellElement') private cellElements;
  private cells: Cell[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    for (const index of Object.keys(this.cellElements)) {
      this.cells.push(new Cell(Number(index) % 7, Number(index) / 7));
    }
  }

}
