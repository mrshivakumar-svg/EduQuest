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
    this.apiService.getAllCourses().subscribe({
      next: (data) => {
        // Filter only approved courses for students
        this.courses = Array.isArray(data.courses) ? data.courses.filter((c:any)=>c.status.toLowerCase()==='approved') : [];

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  viewCourseDetails(id: string) {
    this.router.navigate([`/student/courses/${id}`]);
  }

  enrollInCourse(id: string) {
    this.apiService.enrollInCourse(Number(id)).subscribe({

      next: () => {
        const course = this.courses.find(c => c.id === Number(id));
        if (course) course.isEnrolled = true;
        alert('✅ Enrolled successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to enroll.');
      }
    });
  }

  goToMyEnrollments() {
    this.router.navigate(['/student/enrollments']);
  }
}
