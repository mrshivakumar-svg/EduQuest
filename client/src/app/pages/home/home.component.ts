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
  currentPage = 1;
  totalPages = 0;
  isLoggedIn = false;
  role: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses(this.currentPage);
    this.authService.isLoggedIn$.subscribe((v) => (this.isLoggedIn = v));
    this.authService.role$.subscribe((r) => (this.role = r));
  }

  loadCourses(page: number) {
    this.loading = true;
    this.api.getPublicCourses(page).subscribe({
      next: (res: any) => {
        this.courses = res.courses || [];
        this.totalPages = Math.ceil(res.total / 6); // assuming limit=6
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadCourses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
