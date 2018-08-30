import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'ngx-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  @Input('event') event: Event | Event[];
  @Input('moreEvents') moreEvents = false;
  public show = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('click')
  onClick() {
    this.show = !this.show;
  }

}
