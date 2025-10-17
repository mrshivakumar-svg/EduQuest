import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  myCourses: any[] = [];
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMyCourses();
  }

  fetchMyCourses(): void {
    this.api.getMyCourses().subscribe({
      next: (res) => {
        this.myCourses = res.courses || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching my courses:', err);
        this.loading = false;
      }
    });
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/student/course', courseId]);
  }
}
