import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api'; // backend URL

  constructor(private http: HttpClient) {}

  // Register user
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // Login user
  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }
  getAuthorCourses(): Observable<any> {
    const token = localStorage.getItem('token'); // JWT token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/author/courses`, { headers });
  }
 createCourse(courseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/author/courses`, courseData, { headers });
  }
   getAllCourses(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/student/courses`, { headers });
  }

  getCourseDetails(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/student/courses/${id}`, { headers });
  }

  enrollInCourse(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/student/courses/${id}/enroll`, {}, { headers });
  }

  getMyEnrollments(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/student/my-enrollments`, { headers });
  }

  getCourseContent(courseId: number, contentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.baseUrl}/student/courses/${courseId}/contents/${contentId}`, { headers });
  }

}

