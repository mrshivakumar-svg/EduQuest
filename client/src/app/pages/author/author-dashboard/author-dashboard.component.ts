import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { CommonModalComponent } from '../../../shared/modal/common-modal.component';

@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, CommonModalComponent],
  providers: [ApiService]
})
export class AuthorDashboardComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token found. Redirecting to login.');
      this.modalService.open('Error', 'Please login to continue.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.fetchCourses();
  }

  fetchCourses(): void {
    this.api.getAuthorCourses().subscribe({
      next: (res: any) => {
        this.courses = res.courses || [];
        this.loading = false;

        // Default sort by recent
        this.sortCourses('enrollments');
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading = false;

        if (err.status === 401) {
          this.modalService.open('Session expired. Please login again.', 'error');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else {
          this.modalService.open('Error', 'Failed to fetch courses.', 'error');
        }
      }
    });
  }

  sortCourses(criteria: string) {
    if (criteria === 'enrollments') {
      this.courses.sort((a, b) => b.enrollmentsCount - a.enrollmentsCount);
    } else if (criteria === 'recent') {
      this.courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.sortCourses(value);
    }
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
