import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  imports: [CommonModule],
})
export class StudentDashboardComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  user: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCourses();
  }

  // Navigate to Profile page
  goToProfile(): void {
    this.router.navigate(['/student/profile']);
  }

  // Navigate to My Courses page
  goToMyCourses(): void {
    this.router.navigate(['/student/my-courses']);
  }

  // Load logged-in user profile
  loadUserProfile(): void {
    this.apiService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      },
    });
  }

  // Load all approved courses and mark enrolled ones
  loadCourses(): void {
    this.loading = true;

    this.apiService.getAllCourses().subscribe({
      next: (courseData) => {
        const allCourses = Array.isArray(courseData)
          ? courseData
          : courseData.courses || [];

        this.apiService.getMyEnrollments().subscribe({
          next: (enrollData) => {
            const enrolledIds = Array.isArray(enrollData.enrollments)
              ? enrollData.enrollments.map((e: any) => e.courseId)
              : [];

            this.courses = allCourses
              .filter((c: any) => c.status?.toLowerCase() === 'approved')
              .map((c: any) => ({
                ...c,
                isEnrolled: enrolledIds.includes(c.id),
              }));

            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching enrollments:', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading = false;
      },
    });
  }

  // View details of a course
  viewCourseDetails(id: number): void {
    this.router.navigate(['/student/course', id]);
  }

  // Enroll in a course
  enrollInCourse(id: number): void {
    const course = this.courses.find((c) => c.id === Number(id));
    if (!course) return;

    course.loading = true;

    this.apiService.enrollInCourse(Number(id)).subscribe({
      next: () => {
        course.isEnrolled = true;
        course.loading = false;
        alert('✅ Enrolled successfully!');
      },
      error: (err) => {
        console.error('Enroll error:', err);
        course.loading = false;
        if (err.error?.message === 'Already enrolled in this course') {
          course.isEnrolled = true;
        } else {
          alert('❌ Failed to enroll.');
        }
      },
    });
  }
}
