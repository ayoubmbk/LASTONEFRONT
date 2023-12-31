import { Router } from '@angular/router';
import { Event } from './../../../model/event';
import { EventService } from './../../../services/event.service';
import { Component, OnInit } from '@angular/core';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  getDay
} from 'date-fns';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import { Subject, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dash-calendar',
  templateUrl: './dash-calendar.component.html',
  styleUrls: ['./dash-calendar.component.css']
})
export class DashCalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  excludeDays: number[] = [];
  events$: Observable<Array<CalendarEvent<{ events: Event }>>>;

  constructor(private eventService: EventService, private _router: Router) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventClicked(currEvent: CalendarEvent<{ event: Event }>): void {
    console.log('Event clicked', currEvent.meta.event);
    const clickedEvent = currEvent.meta.event;
    if (clickedEvent.eventType === 'leave') {
      console.log('This is leave event', clickedEvent.eventId);
      this._router.navigate(['/leaverequests/details/' + clickedEvent.eventId]);
    } else {
      console.log('This is an event', clickedEvent.eventId);
      this._router.navigate(['/event/details/' + clickedEvent.eventId]);
    }
  }

  fetchEvents(): void {
    const getStart: any = { month: startOfMonth, week: startOfWeek, day: startOfDay }[this.view];
    const getEnd: any = { month: endOfMonth, week: endOfWeek, day: endOfDay }[this.view];
    const date1 = format(getStart(this.viewDate), 'yyyy-MM-dd');
    const date2 = format(getEnd(this.viewDate), 'yyyy-MM-dd');
    
    console.log('Fetching events for date range:', date1, 'to', date2); // Add this line
    
    this.events$ = this.eventService.getLeaveAndEventsBetweenDate(date1, date2)
      .pipe(
        map((results: any) => {
          console.log('Fetched raw data:', results); // Add this line
          return results.map((event: Event) => {
            console.log('Mapping event:', event); // Add this line
            return {
              title: event.title,
              start: startOfDay(new Date(event.startDate)),
              end: endOfDay(new Date(event.endDate)),
              allDay: true,
              color: event.eventType === 'leave' ? { primary: '#2f79ef' } : { primary: '#e21841' },
              meta: {
                event
              }
            };
          });
        }));
  }
}
