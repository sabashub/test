import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../../components/category/category.component';
import { User } from '../../models/User';
//import { CalendarComponent } from '../../components/calendar/calendar.component';
import { UserCalendarComponent } from '../../components/user-calendar/user-calendar.component';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, CategoryComponent, UserCalendarComponent, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  user: User | null = null;
  passwordResetEmail: string = ''; // Variable to hold the email for password reset
  appointments: any[] = []
  userId: string = ''
  constructor(private appService: AppService, private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.appService.user$.subscribe(user => {
      this.user = user;
      this.userId = this.user?.id
      
      this.getAppointmentsByUserId(this.userId)
    });
  }
  getAppointmentsByUserId(userId: any): void {
    const apiUrl = `http://localhost:5005/api/Appointment/getByUserId/${userId}`;
    
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.appointments = response.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date)
        }));
       
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  

  openForgetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      width: '700px', height: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}