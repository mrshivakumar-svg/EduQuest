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
    const token = localStorage.getItem('authToken'); // Assumes you store the token here after login
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Course Management
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`, { headers: this.getAuthHeaders() });
  }

  publishCourse(courseId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/${courseId}/publish`, {}, { headers: this.getAuthHeaders() });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${courseId}`, { headers: this.getAuthHeaders() });
  }

  // Author Management
  getAllAuthors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/authors`, { headers: this.getAuthHeaders() });
  }

  createAuthor(authorData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authors`, authorData, { headers: this.getAuthHeaders() });
  }

  deleteAuthor(authorId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/authors/${authorId}`, { headers: this.getAuthHeaders() });
  }

  // ✅ ADDED SECTION: Student Management
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students`, { headers: this.getAuthHeaders() });
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/students/${studentId}`, { headers: this.getAuthHeaders() });
  }
}