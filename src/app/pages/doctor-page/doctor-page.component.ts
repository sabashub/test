import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { CategoryComponent } from '../../components/category/category.component';
import { AppService } from '../../app.service';
import { Doctor } from '../../models/Doctor';
import { User } from '../../models/User';
import { DoctorCalendarComponent } from '../../components/doctor-calendar/doctor-calendar.component';
 import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [ CategoryComponent, DoctorCalendarComponent, ForgetPasswordComponent],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent implements OnInit{
  doctor: User | null = null;
  doctorId: any = null;
  appointments: any = []
    constructor(private appService: AppService, private http: HttpClient, private dialog: MatDialog) { }
    ngOnInit(): void {
      this.appService.user$.subscribe(doctor => {
        this.doctor = doctor;
        this.doctorId = this.doctor?.id
        console.log('User:', this.doctor);
      });
      this.getAppointmentsByDoctorId()
      }
      getAppointmentsByDoctorId(): void {
        const apiUrl = `http://localhost:5005/api/Appointment/getByDoctorId/${this.doctorId}`;
        this.http.get<any[]>(apiUrl).subscribe(
          (response: any) => {
            // Parse date strings into Date objects
            this.appointments = response.map((appointment: any) => ({
              ...appointment,
              date: new Date(appointment.date),
            }));
           
          },
          (error: any) => {
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



