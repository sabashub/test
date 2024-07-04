import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { Doctor } from '../../models/Doctor';


@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-calendar.component.html',
  styleUrl: './doctor-calendar.component.css',
})
export class DoctorCalendarComponent implements OnInit {
  @Input() doctorId: number = 0;
  currentMonth: string = '';
  currentYear: number = 2024;
  currentDay: number = 1;
  weekDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  hours: number[] = Array.from({ length: 9 }, (_, i) => i + 9);
  appointments: any[] = [];
  backgroundColor: string = '';
  showDialog = false;
  user: User | null = null;
  doctor: Doctor | null = null;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private appService: AppService
  ) {
    const currentDate = new Date();
    this.currentMonth = currentDate.toLocaleString('default', {
      month: 'long',
    });
    this.currentYear = currentDate.getFullYear();
    this.currentDay = currentDate.getDate();
  }

  ngOnInit(): void {
    this.getUser();
    this.getAppointmentsByDoctorId();
    this.fetchDoctorDetails(this.doctorId.toString());
  }

  isMyAppointment(day: number, hour: number): boolean {
    if (!this.user) return false;

    const selectedDate = new Date(
      this.currentYear,
      this.getMonthNumber(this.currentMonth),
      day,
      hour
    );
    return this.appointments.some(
      (appointment) =>
        appointment.date.getTime() === selectedDate.getTime() &&
        appointment.userId === this.user?.id
    );
  }

  getUser() {
    this.appService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  fetchDoctorDetails(doctorId: string): void {
    this.appService.getDoctorById(doctorId).subscribe(
      (doctor: Doctor) => {
        this.doctor = doctor;
        
      },
      (error) => {
        console.error('Error fetching doctor details:', error);
      }
    );
  }

  getBackgroundColor(day: string): string {
    if (day === 'შაბ' || day === 'კვი') {
      return 'rgb(248, 248, 235)';
    } else {
      return '#ffffff';
    }
  }

  scheduleAppointment(hour: number, day: number, problem: string) {
    const selectedDate = new Date(
      this.currentYear,
      this.getMonthNumber(this.currentMonth),
      day,
      hour + 4
    );
    if (!isNaN(selectedDate.getTime())) {
      const appointmentsForHour = this.appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getHours() === hour &&
          appointmentDate.getDate() === day
        );
      });

      if (appointmentsForHour.length < 3) {
       
        const appointment: any = {
          date: selectedDate,
          problem: problem,
          userId: this.user?.id,
          doctorId: this.doctorId,
        };
        this.http
          .post('http://localhost:5005/api/Appointment/create', appointment)
          .subscribe(
            (response) => {
             
              this.getAppointmentsByDoctorId();
             
            },
            (error) => {
              console.error('Error creating appointment:', error);
            }
          );
      } else {
        console.error('Maximum appointments reached for this hour');
      }
    } else {
      console.error('Invalid Date');
    }
  }

  getAppointmentsByDoctorId(): void {
    const apiUrl = `http://localhost:5005/api/Appointment/getByDoctorId/${this.doctorId}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        // Parse date strings into Date objects
        this.appointments = response.map((appointment) => ({
          ...appointment,
          date: new Date(appointment.date),
        }));
        console.log('Appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  isWeekend(day: number): boolean {
    const weekDayIndex = day % 7;
    return weekDayIndex === 3 || weekDayIndex === 4;
  }

  openDialog(hour: number, day: number): void {
    if (!this.isAppointmentScheduled(day, hour)) {
      this.showDialog = true;


      if (this.showDialog && this.user) {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '400px',
          data: { problem: '' },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result && result.problem.trim() !== '') {
            this.scheduleAppointment(hour, day, result.problem);
          }
        });
      } else {
        console.error('User is not authorized to book appointments');
      }
 
      this.showDialog = false;
    } else if (this.isWeekend(day)) {
      console.error('Cannot book appointments on weekend days');
    }
  }

  isAppointmentScheduled(day: number, hour: number): boolean {
    const selectedDate = new Date(
      this.currentYear,
      this.getMonthNumber(this.currentMonth),
      day,
      hour
    );
    return this.appointments.some(
      (appointment) => appointment.date.getTime() === selectedDate.getTime()
    );
  }

  getMonthNumber(month: string): number {
    const months: { [month: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    return months[month];
  }

  nextWeek() {
    const daysInMonth = this.getDaysInMonth(
      this.currentMonth,
      this.currentYear
    );
    const remainingDaysInMonth = daysInMonth - this.currentDay;

    if (remainingDaysInMonth >= 7) {
      this.currentDay += 7;
    } else {
      const daysToNextMonth = 7 - remainingDaysInMonth;
      const nextMonthIndex = this.getMonthNumber(this.currentMonth) + 1;

      if (nextMonthIndex > 11) {
        this.currentYear++;
        this.currentMonth = 'January';
      } else {
        this.currentMonth = Object.keys(this.getMonths())[nextMonthIndex];
      }

      const daysInNextMonth = this.getDaysInMonth(
        this.currentMonth,
        this.currentYear
      );
      this.currentDay =
        daysToNextMonth <= daysInNextMonth ? daysToNextMonth : daysInNextMonth;
    }
  }

  prevWeek() {
    if (this.currentDay - 7 >= 1) {
      this.currentDay -= 7;
    } else {
      const prevMonthIndex = this.getMonthNumber(this.currentMonth) - 1;
      if (prevMonthIndex < 0) {
        this.currentYear--;
        this.currentMonth = 'December';
      } else {
        this.currentMonth = Object.keys(this.getMonths())[prevMonthIndex];
      }
      const prevMonthDays = this.getDaysInMonth(
        this.currentMonth,
        this.currentYear
      );
      this.currentDay = prevMonthDays - (7 - this.currentDay);
    }
  }

  getDaysInMonth(month: string, year: number): number {
    const thirtyDaysMonths = ['April', 'June', 'September', 'November'];
    const isThirtyDaysMonth = thirtyDaysMonths.includes(month);

    if (isThirtyDaysMonth) {
      return 30;
    } else if (month === 'February') {
 
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 31; 
    }
  }

  getMonths(): { [month: string]: number } {
    return {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
  }

  getDayIndex(day: string): number {
    const index = this.weekDays.indexOf(day);
    return index === -1 ? 0 : index;
  }

  isMaxAppointmentsReached(day: number, hour: number): boolean {
    const appointmentsForHour = this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getHours() === hour && appointmentDate.getDate() === day
      );
    });

    return appointmentsForHour.length >= 3;
  }
}
