import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Make sure this key matches where the token is saved during login
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Course Management ---
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`, { headers: this.getAuthHeaders() });
  }

  // ✅ ADDED Method to get details for one course
  getCourseDetails(courseId: number): Observable<any> {
    // Assumes backend endpoint exists at GET /api/admin/courses/:id
    return this.http.get<any>(`${this.baseUrl}/courses/${courseId}`, { headers: this.getAuthHeaders() });
  }

  publishCourse(courseId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/${courseId}/publish`, {}, { headers: this.getAuthHeaders() });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${courseId}`, { headers: this.getAuthHeaders() });
  }

  getCourseEnrollments(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses/${courseId}/enrollments`, { headers: this.getAuthHeaders() });
  }

  // --- Author Management ---
  getAllAuthors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/authors`, { headers: this.getAuthHeaders() });
  }

  createAuthor(authorData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authors`, authorData, { headers: this.getAuthHeaders() });
  }

  deleteAuthor(authorId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/authors/${authorId}`, { headers: this.getAuthHeaders() });
  }

  // --- Student Management ---
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students`, { headers: this.getAuthHeaders() });
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/students/${studentId}`, { headers: this.getAuthHeaders() });
  }

  getStudentEnrollments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students/${studentId}/enrollments`, { headers: this.getAuthHeaders() });
  }
}

