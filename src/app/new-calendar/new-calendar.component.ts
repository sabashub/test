import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserModule } from '@angular/platform-browser';

import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
@Component({
  selector: 'app-new-calendar',
  standalone: true,
  imports: [],
  templateUrl: './new-calendar.component.html',
  styleUrl: './new-calendar.component.css'
})
export class NewCalendarComponent {


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };
}
