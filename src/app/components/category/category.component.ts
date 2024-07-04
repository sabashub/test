import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.fetchCategories()
  }

  
    fetchCategories(): void {
      this.appService.getCategories().subscribe(
        (categories: Category[]) => {
          this.categories = categories;
          console.log('Categories:', this.categories);
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
    }
    editCategory(category: Category): void {
      const newName = prompt('Enter the new category name:', category.name);
      if (newName !== null) {
        category.name = newName;
        this.appService.updateCategory(category.id, category).subscribe(() => {
          this.fetchCategories();
        });
      }
    }
  
    deleteCategory(categoryId: number): void {
      this.appService.deleteCategory(categoryId).subscribe(() => {
        this.fetchCategories();
      });
    }

}
