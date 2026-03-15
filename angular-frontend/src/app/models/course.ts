export interface Course {
  _id?: string;
  name: string;
  description: string;
  duration: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}