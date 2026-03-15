import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Student } from '../../models/student';
import { Course } from '../../models/course';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  
  stats: any = { totalStudents: 0, activeCourses: 0, graduates: 0, successRate: 0 };
  recentStudents: Student[] = [];
  courses: Course[] = [];

  // Modál és űrlap változók
  isModalOpen = false;
  isDeleteModalOpen = false;
  editingId: string | null = null;
  itemToDeleteId: string | null = null;

  formData: any = {
    name: '',
    email: '',
    course: '',
    enrollmentDate: '',
    status: 'active'
  };

  ngOnInit() {
    this.loadData();
    this.loadCourses();
  }

  loadData() {
    this.apiService.getDashboardStats().subscribe(data => {
      this.stats = data;
      this.cdr.detectChanges();
    });
    this.apiService.getStudents().subscribe(data => {
      this.recentStudents = data.slice(0, 5);
      this.cdr.detectChanges();
    });
  }

  loadCourses() {
    this.apiService.getCourses().subscribe(data => {
      this.courses = data.filter(c => c.status === 'active');
    });
  }

  // Modál kezelés
  openModal(student?: Student) {
    if (student) {
      this.editingId = student._id || null;
      this.formData = {
        name: student.name,
        email: student.email,
        course: student.course,
        enrollmentDate: new Date(student.enrollmentDate).toISOString().split('T')[0],
        status: student.status
      };
    } else {
      this.editingId = null;
      this.formData = { name: '', email: '', course: '', enrollmentDate: '', status: 'active' };
    }
    this.isModalOpen = true;
  }

  confirmDelete(id: string) {
    this.itemToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  saveStudent() {
    const request = this.editingId 
      ? this.apiService.updateStudent(this.editingId, this.formData)
      : this.apiService.createStudent(this.formData);

    request.subscribe({
      next: () => {
        this.loadData();
        this.isModalOpen = false;
      },
      error: (err) => alert(err.error?.message || 'Hiba történt mentéskor')
    });
  }

  deleteItem() {
    if (this.itemToDeleteId) {
      this.apiService.deleteStudent(this.itemToDeleteId).subscribe({
        next: () => {
          this.loadData();
          this.isDeleteModalOpen = false;
        },
        error: (err) => {
          alert(err.error?.message || 'Hiba a törlés során');
          this.isDeleteModalOpen = false;
        }
      });
    }
  }
}