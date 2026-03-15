import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  
  // Modál állapotok
  isModalOpen = false;
  isDeleteModalOpen = false;
  
  editingId: string | null = null;
  itemToDeleteId: string | null = null;

  formData: any = {
    name: '',
    description: '',
    duration: 1,
    status: 'active'
  };

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.apiService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Hiba a kurzusok betöltésekor', err)
    });
  }

  // Szerkesztés/Hozzáadás modál
  openModal(course?: Course) {
    if (course) {
      this.editingId = course._id || null;
      this.formData = {
        name: course.name,
        description: course.description,
        duration: course.duration,
        status: course.status
      };
    } else {
      this.editingId = null;
      this.formData = { name: '', description: '', duration: 1, status: 'active' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Törlés modál megnyitása
  confirmDelete(id: string) {
    this.itemToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.itemToDeleteId = null;
  }

  saveCourse() {
    const request = this.editingId 
      ? this.apiService.updateCourse(this.editingId, this.formData)
      : this.apiService.createCourse(this.formData);

    request.subscribe({
      next: () => {
        this.loadCourses();
        this.closeModal();
      },
      error: (err) => alert(err.error?.message || 'Hiba történt a mentés során')
    });
  }

  // Tényleges törlés hívása
  deleteItem() {
    if (this.itemToDeleteId) {
      this.apiService.deleteCourse(this.itemToDeleteId).subscribe({
        next: () => {
          this.loadCourses();
          this.closeDeleteModal();
        },
        error: (err) => {
          // A backend nem engedi törölni a kurzust, ha vannak benne diákok
          alert(err.error?.message || 'Hiba történt a törlés során');
          this.closeDeleteModal();
        }
      });
    }
  }
}