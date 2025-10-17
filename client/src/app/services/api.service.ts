import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Auth APIs
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // ================== Author APIs ==================
  getAuthorCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/author/courses`, {
      headers: this.getAuthHeaders()
    });
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/author/courses`, courseData, {
      headers: this.getAuthHeaders()
    });
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/author/courses/${id}`, courseData, {
      headers: this.getAuthHeaders()
    });
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/author/courses/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCourseContent(courseId: number, contentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/author/courses/${courseId}/contents`, contentData, {
      headers: this.getAuthHeaders()
    });
  }

  updateCourseContent(contentId: number, contentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/author/contents/${contentId}`, contentData, {
      headers: this.getAuthHeaders()
    });
  }

  // ================== Student APIs (UNCHANGED) ==================
  getAllCourses(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/student/courses`, { headers });
  }

  getCourseDetails(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/student/courses/${id}`, { headers });
  }

  enrollInCourse(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/student/courses/${id}/enroll`, {}, { headers });
  }

  getMyEnrollments(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/student/my-enrollments`, { headers });
  }

  getCourseContent(courseId: number, contentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/student/courses/${courseId}/contents/${contentId}`, { headers });
  }
}
