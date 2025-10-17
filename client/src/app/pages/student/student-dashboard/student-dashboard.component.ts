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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;

    // Step 1: Get all approved courses
    this.apiService.getAllCourses().subscribe({
      next: (courseData) => {
        const allCourses = Array.isArray(courseData)
          ? courseData
          : courseData.courses || [];

        // Step 2: Get student's enrollments
        this.apiService.getMyEnrollments().subscribe({
          next: (enrollData) => {
            const enrolledIds = Array.isArray(enrollData)
              ? enrollData.map((e: any) => e.courseId)
              : (enrollData.enrollments || []).map((e: any) => e.courseId);

            // Step 3: Combine both
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

  viewCourseDetails(id: string) {
    this.router.navigate([`/student/courses/${id}`]);
  }

  enrollInCourse(id: string) {
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
        console.error(err);
        course.loading = false;
        if (err.error?.message === 'Already enrolled in this course') {
          course.isEnrolled = true; // reflect it instantly
        } else {
          alert('❌ Failed to enroll.');
        }
      },
    });
  }

  goToMyEnrollments() {
    this.router.navigate(['/student/enrollments']);
  }
}
