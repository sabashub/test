import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from '../../models/Category';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})
export class RegisterDoctorComponent  implements OnInit{
  model: any = {};
  categories: Category[] = []

  constructor(private http: HttpClient, private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
    
  }
  loadCategories() {
    this.appService.getCategories().subscribe(
      data => {
        this.categories = data;
       
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
    
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('firstName', this.model.firstName);
    formData.append('lastName', this.model.lastName);
    formData.append('email', this.model.email);
    formData.append('password', this.model.password);
    formData.append('privateNumber', this.model.privateNumber);
    formData.append('achievements', this.model.achievements);
    formData.append('category', this.model.category);
    formData.append('image', this.model.image);
    formData.append('cv', this.model.cv);

    

    this.http.post<any>('http://localhost:5005/api/doctor/register', formData).subscribe(
      data => {
        
        // Clear the form after successful registration
        this.model = {};

      this.router.navigateByUrl('/admin');
      },
      error => {
        console.error('Error registering doctor:', error);
      }
   );
   this.router.navigateByUrl('/')

  }

  

  onImageChange(event: any) {
    this.model.image = event.target.files[0];
  }

  onCVChange(event: any) {
    this.model.cv = event.target.files[0];
  }
  onCategoryChange(event: any) {
    this.model.category = event.target.value;
  }
}
