import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.scss'],
  imports: [CommonModule],
})
export class MyEnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  loading = true;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getMyEnrollments().subscribe({
      next: (data: any) => {
        // Normalize backend data: ensure `course` exists
        this.enrollments = data.enrollments.map((e: any) => ({
          ...e,
          course: e.Course, // map backend Course to course
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  viewCourseDetails(id: number) {
    this.router.navigate([`/student/courses/${id}`]);
  }
}
