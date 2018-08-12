import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxCalendarLibModule} from '../../projects/ngx-calendar-lib/src/lib/ngx-calendar-lib.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCalendarLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
