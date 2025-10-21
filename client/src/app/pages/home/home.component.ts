import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  page = 1;
  hasMore = false;
  isLoggedIn = false;
  role: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.authService.isLoggedIn$.subscribe((v) => (this.isLoggedIn = v));
    this.authService.role$.subscribe((r) => (this.role = r));
  }

  loadCourses() {
    this.loading = true;
    this.api.getPublicCourses(this.page).subscribe({
      next: (res: any) => {
        this.courses = [...this.courses, ...res.courses];
        this.hasMore = res.hasMore;
        this.loading = false;
      },
      error: () => (this.loading = false),
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
