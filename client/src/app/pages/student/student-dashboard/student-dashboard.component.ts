import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [ApiService],
})
export class StudentDashboardComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;
  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.loadCourses();
  }
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
            this.courses = allCourses.map((course: any) => ({
              ...course,
              isEnrolled: enrolledIds.includes(course.id),
              loading: false,
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching enrollments:', err);
            this.courses = allCourses.map((course: any) => ({
              ...course,
              isEnrolled: false,
              loading: false,
            }));
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.courses = [];
        this.loading = false;
      },
    });
  }
  enrollInCourse(courseId: number): void {
  const course = this.courses.find(c => c.id === courseId);
  if (!course || course.isEnrolled) return;
  course.loading = true;
  this.apiService.enrollInCourse(courseId).subscribe({
    next: () => {
      course.isEnrolled = true; // Immediately mark as enrolled
      course.loading = false;
      alert('You have successfully enrolled in the course!');
    },
    error: (err) => {
      console.error('Error enrolling:', err);
      course.loading = false;
      if (err?.error?.message === 'Already enrolled') {
        course.isEnrolled = true;
        alert('You are already enrolled in this course.');
      } else {
        alert('Error enrolling in course. Please try again.');
      }
    },
  });
}
  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/student/course', courseId]);
  }
  goToProfile(): void {
    this.router.navigate(['/student/profile']);
  }
  goToMyCourses(): void {
    this.router.navigate(['/student/my-courses']);
  }
}