import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { StudentsComponent } from './pages/students/students';
import { CoursesComponent } from './pages/courses/courses';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: '**', redirectTo: 'dashboard' }
];