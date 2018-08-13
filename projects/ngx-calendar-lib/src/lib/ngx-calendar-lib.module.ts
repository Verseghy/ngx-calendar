import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NgxCalendarLibComponent } from './ngx-calendar-lib.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NgxCalendarLibComponent],
  exports: [NgxCalendarLibComponent]
})
export class NgxCalendarLibModule { }
