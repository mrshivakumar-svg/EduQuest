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
  getAuthorProfile(): Observable<any> {
  return this.http.get(`${this.apiUrl}/author/profile`, {
    headers: this.getAuthHeaders()
  });
}
getCourseByIdForAuthor(id: number | string): Observable<any> {
  return this.http.get(`${this.apiUrl}/author/courses/${id}`, { headers: this.getAuthHeaders() });
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
 getCourseDetailsByRole(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role'); // store role on login
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  if (role === 'admin') {
    return this.http.get(`${this.apiUrl}/admin/courses/${id}`, { headers });
  } else {
    return this.http.get(`${this.apiUrl}/student/courses/${id}`, { headers });
  }
}

  enrollInCourse(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
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

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  return this.http.get(`${this.apiUrl}/student/profile`, { headers });
}
// Get my courses
getMyCourses(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.get(`${this.apiUrl}/student/my-courses`, { headers });
}
getPublicCourses(page = 1, limit = 6): Observable<any> {
  return this.http.get(`${this.apiUrl}/public/courses?page=${page}&limit=${limit}`);
}
updateProfile(data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put(`${this.apiUrl}/student/profile`, data, { headers });
}




// ================== Admin APIs ==================
  adminGetAllCourses(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.apiUrl}/admin/courses`, { headers });
  }

  publishCourse(courseId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/admin/courses/${courseId}/publish`, {}, { headers });
  }

  adminDeleteCourse(courseId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete(`${this.apiUrl}/admin/courses/${courseId}`, { headers });
  }

  getAllAuthors(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.apiUrl}/admin/authors`, { headers });
  }

  createAuthor(authorData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/admin/authors`, authorData, { headers });
  }

  deleteAuthor(authorId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete(`${this.apiUrl}/admin/authors/${authorId}`, { headers });
  }

  getAllStudents(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.apiUrl}/admin/students`, { headers });
  }

  deleteStudent(studentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete(`${this.apiUrl}/admin/students/${studentId}`, { headers });
  }
}





















