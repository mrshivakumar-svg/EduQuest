import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [ApiService]
})
export class AuthorDashboardComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Only access localStorage if window is defined (client-side)
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token found. Redirecting to login.');
      this.router.navigate(['/login']); // redirect if not logged in
      return;
    }

    this.fetchCourses();
  }

  fetchCourses(): void {
    this.api.getAuthorCourses().subscribe({
      next: (res: any) => {
        console.log('Courses fetched from frontend:', res);
        this.courses = res.courses || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading = false;

        if (err.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  editCourse(courseId: string): void {
    this.router.navigate(['/author/create-course', courseId]);
  }

  goToCreateCourse(): void {
    this.router.navigate(['/author/courses/create']);
  }

  uploadContent(courseId: number): void {
    this.router.navigate(['/author/create/course', courseId]);
  }
  goToProfile(): void {
  this.router.navigate(['/author/profile']);
}

}
