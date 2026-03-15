export interface Student {
  _id?: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string | Date;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}