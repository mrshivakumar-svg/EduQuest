import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class MyEnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  loading = true;
  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit() {
    this.loadEnrollments();
  }
  loadEnrollments() {
    this.loading = true;
    this.apiService.getMyEnrollments().subscribe({
      next: (data: any) => {
        // Map backend response to include course info
        this.enrollments = Array.isArray(data.enrollments)
          ? data.enrollments.map((e: any) => ({
              ...e,
              course: e.course, // use alias "course"
            }))
          : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching enrollments:', err);
        this.loading = false;
      },
    });
  }
  viewCourseDetails(courseId: number) {
    this.router.navigate([`/student/course/${courseId}`]);
  }
}