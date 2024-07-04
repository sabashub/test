import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/Doctor';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DoctorCalendarComponent } from '../doctor-calendar/doctor-calendar.component';
@Component({
  selector: 'app-doctors-grid',
  standalone: true,
  imports: [CommonModule, DoctorCalendarComponent],
  templateUrl: './doctors-grid.component.html',
  styleUrl: './doctors-grid.component.css'
})
export class DoctorsGridComponent implements OnInit{
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  doctorId: any = 0
  constructor(private appService: AppService,    private http: HttpClient,) { }

  ngOnInit(): void {
    this.fetchDoctors();
    
  }

  fetchDoctors(): void {
    this.appService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        
       
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
    
  }

  editDoctor(doctor: Doctor): void {
    // Implement edit functionality
  }

 
    deleteDoctor(doctor: Doctor): void {
      if (confirm('Are you sure you want to delete this doctor?')) {
        this.appService.deleteDoctorById(doctor.id).subscribe(
          () => {
            // Filter out the deleted doctor from the local array
            this.doctors = this.doctors.filter(d => d.id !== doctor.id);
            
          },
          (error) => {
            console.error('Error deleting doctor:', error);
          }
        );
      }
    }
  
    showDoctorDetails(doctor: Doctor): void {
      this.selectedDoctor = doctor;
      this.doctorId = this.selectedDoctor.id
      
    }

    hideDoctorDetails(): void {
      this.selectedDoctor = null;
    }


  sendResetCode(): void {
    if (!this.selectedDoctor?.email) {
      alert('User email not found. Please try again later.');
      return;
    }

    const newPassword = prompt('enter new password')

    // Make a POST request to initiate password reset
    this.http.post<any>('http://localhost:5005/api/Doctor/forgot-password', { email: this.selectedDoctor.email, newPassword: newPassword }).subscribe(
      (response: any) => {
        // Handle success response, if needed
        //alert(response.message);
      },
      (error: any) => {
        // Handle error response, if needed
        console.error(error);
       
      }
    );
  }
    
  
  
}
