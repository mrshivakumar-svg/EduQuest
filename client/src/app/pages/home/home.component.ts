import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  page = 1;
  hasMore = false;
  isLoggedIn = false;
  role: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.loadCourses();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    this.isLoggedIn = !!token;
    this.role = role;
  }

  loadCourses() {
    this.loading = true;
    this.api.getPublicCourses(this.page).subscribe({
      next: (res: any) => {
        this.courses = [...this.courses, ...res.courses];
        this.hasMore = res.hasMore;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading = false;
      },
    });
  }

  loadMore() {
    if (this.hasMore) {
      this.page++;
      this.loadCourses();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  loginToViewCourse() {
    this.router.navigate(['/login'], { queryParams: { redirectTo: '/' } });
  }

  viewCourseDetails(courseId: number) {
     this.router.navigate(['/student/course', courseId]);
  }
}
