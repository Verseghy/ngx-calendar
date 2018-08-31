import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCalendarLibComponent } from './ngx-calendar-lib.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NgxCalendarLibComponent, PopupComponent],
  exports: [NgxCalendarLibComponent]
})
export class NgxCalendarLibModule { }
