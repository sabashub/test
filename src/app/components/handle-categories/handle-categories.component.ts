import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from '../../models/Category';
import { Doctor } from '../../models/Doctor';
import { coerceStringArray } from '@angular/cdk/coercion';

@Component({
  selector: 'app-handle-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './handle-categories.component.html',
  styleUrl: './handle-categories.component.css'
})
export class HandleCategoriesComponent implements OnInit{
  categories: Category[] = [];
  newCategory: string = '';
  editedCategory: Category | null = null;
  editedCategoryIndex: number = -1;
  doctors: any = []
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.fetchDoctors()
  }

  fetchDoctors(clicked = true): void {
    this.appService.getDoctors(clicked ? '' : 'amount=6').subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  loadCategories(): void {
    this.appService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory(): void {
    if (this.newCategory.trim() !== '') {
      this.appService.addCategory(this.newCategory.trim()).subscribe(response => {
        this.newCategory = '';
        this.loadCategories();
      });
    }
  }

  editCategory(category: Category): void {
    
    const newName = prompt('Enter the new category name:', category.name);
    if (newName !== null) {
      category.name = newName;
      this.appService.updateCategory(category.id, category).subscribe(() => {
        this.loadCategories();
      });
    }
  } 

  deleteCategory(category: Category): void {
    // Check if the category is associated with any doctor
    const isCategoryUsedByDoctor = this.doctors.some((doctor: any) => doctor.category === category.name);
  
    if (isCategoryUsedByDoctor) {
      // Display an alert informing the user that the category is used by a doctor
      alert('This category is used by a doctor and cannot be deleted.');
    } else {
      // If the category is not associated with any doctor, proceed with deletion
      this.appService.deleteCategory(category.id).subscribe(() => {
        this.loadCategories();
      });
    }
}

}
