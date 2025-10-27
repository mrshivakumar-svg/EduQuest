import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { CommonModalComponent } from '../../../shared/modal/common-modal.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule, CommonModalComponent],
  providers: [ApiService],
})
export class StudentDashboardComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalService: ModalService
  ) {}

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
    const course = this.courses.find((c) => c.id === courseId);
    if (!course || course.isEnrolled) return;

    course.loading = true;
    this.apiService.enrollInCourse(courseId).subscribe({
      next: () => {
        course.isEnrolled = true;
        course.loading = false;
        this.modalService.open(
          'Success',
          'You have successfully enrolled!',
          'success'
        );
      },
      error: (err) => {
        console.error('Error enrolling:', err);
        course.loading = false;

        if (err?.error?.message === 'Already enrolled') {
          course.isEnrolled = true;
          this.modalService.open(
            'Info',
            'You are already enrolled in this course.',
            'info'
          );
        } else {
          this.modalService.open(
            'Error',
            'Error enrolling in course. Please try again.',
            'error'
          );
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
