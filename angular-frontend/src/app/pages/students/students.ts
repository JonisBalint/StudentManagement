import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Student } from '../../models/student';
import { Course } from '../../models/course';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class StudentsComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  students: Student[] = [];
  courses: Course[] = [];
  searchTerm: string = ''; // Itt tároljuk a keresett szót

  isModalOpen = false;
  isDeleteModalOpen = false;
  editingId: string | null = null;
  itemToDeleteId: string | null = null;
  formData: any = { name: '', email: '', course: '', enrollmentDate: '', status: 'active' };

  ngOnInit() {
    this.loadData();
    // Figyeljük az URL-t a keresési paraméter miatt (?q=...)
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.cdr.detectChanges();
    });
  }

  loadData() {
    this.apiService.getStudents().subscribe(data => { 
      this.students = data; 
      this.cdr.detectChanges(); 
    });
    this.apiService.getCourses().subscribe(data => { 
      this.courses = data.filter(c => c.status === 'active'); 
    });
  }

  // Ez a függvény végzi a tényleges szűrést a HTML számára
  get filteredStudents() {
    if (!this.searchTerm.trim()) {
      return this.students;
    }
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.email.toLowerCase().includes(term) ||
      s.course.toLowerCase().includes(term)
    );
  }

  openModal(student?: Student) {
    if (student) {
      this.editingId = student._id!;
      this.formData = { ...student, enrollmentDate: new Date(student.enrollmentDate).toISOString().split('T')[0] };
    } else {
      this.editingId = null;
      this.formData = { name: '', email: '', course: '', enrollmentDate: '', status: 'active' };
    }
    this.isModalOpen = true;
  }

  saveStudent() {
    const req = this.editingId ? this.apiService.updateStudent(this.editingId, this.formData) : this.apiService.createStudent(this.formData);
    req.subscribe(() => { this.loadData(); this.isModalOpen = false; });
  }

  confirmDelete(id: string) { this.itemToDeleteId = id; this.isDeleteModalOpen = true; }

  deleteItem() {
    if (this.itemToDeleteId) {
      this.apiService.deleteStudent(this.itemToDeleteId).subscribe({
        next: () => { this.loadData(); this.isDeleteModalOpen = false; },
        error: (err) => alert(err.error?.message || 'Hiba')
      });
    }
  }
}