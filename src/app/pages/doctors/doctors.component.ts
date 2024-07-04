import { Component } from '@angular/core';
import { DoctorCardComponent } from '../../components/doctor-card/doctor-card.component';
import { AppService } from '../../app.service';
import { Doctor } from '../../models/Doctor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [DoctorCardComponent, CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent {
  doctors: Doctor[] = [];
  showMore: boolean = false;

  constructor(private appService: AppService, private router: Router) {}
  ngOnInit(): void {
    this.fetchDoctors();
  }
  fetchDoctors(clicked = false): void {
    this.appService.getDoctors(clicked ? '' : 'amount=6').subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        console.log('Doctors:', this.doctors);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
  getImageUrl(imageName: string): string {
   
    return `/images/${imageName}`; 
  }
  viewDoctorDetails(doctorId: number): void {
    this.router.navigate(['/doctor', doctorId.toString()]);
  }

  toggleSeeMore(): void {
    this.showMore = !this.showMore; // Toggle showMore flag
    this.fetchDoctors(this.showMore); // Fetch doctors based on new showMore state
  }

  isDoctorsArrayLongEnough(): boolean {
    return this.doctors.length > 5
  }
}