import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.scss'],
  imports: [CommonModule, HttpClientModule]
})
export class AuthorDashboardComponent implements OnInit {

  courses: any[] = [];
  loading: boolean = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
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
      }
    });
  }

  editCourse(courseId: number): void {
    this.router.navigate(['/edit-course', courseId]);
  }

  goToCreateCourse(): void {
    // Navigate to create-course form component
    this.router.navigate(['/create-course']);
  }

  uploadContent(courseId: number): void {
    // Navigate to content upload page
    this.router.navigate(['/author/create/course', courseId]);
  }
}
