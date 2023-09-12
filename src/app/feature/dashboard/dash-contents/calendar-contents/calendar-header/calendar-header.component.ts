import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent {

  @Input()
  view: CalendarView;

  @Input()
  viewDate: Date;

  @Input()
  locale = 'en';

  @Output()
  viewChange: EventEmitter<string> = new EventEmitter();

  @Output()
  viewDateChange: EventEmitter<Date> = new EventEmitter();
  
  constructor() {
    this.view = CalendarView.Month; // Set the default view to 'month'
  }

}
