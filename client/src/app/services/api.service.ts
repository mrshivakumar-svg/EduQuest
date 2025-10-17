import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Helper - Get JWT Token
  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  // Common Header with Auth
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // Auth APIs
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  // Author APIs
  getAuthorCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/author/courses`, {
      headers: this.getAuthHeaders()
    });
  }
  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/author/courses`, courseData, {
      headers: this.getAuthHeaders()
    });
  }
  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/author/courses/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/author/courses/${id}`, courseData, {
      headers: this.getAuthHeaders()
    });
  }
  addCourseContent(courseId: number, contentData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/author/courses/${courseId}/contents`,
      contentData,
      { headers: this.getAuthHeaders() }
    );
  }
  updateCourseContent(contentId: number, contentData: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/author/contents/${contentId}`,
      contentData,
      { headers: this.getAuthHeaders() }
    );
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
