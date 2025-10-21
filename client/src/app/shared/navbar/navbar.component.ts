import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentRoute = '';
  isLoggedIn = false;
  role: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    // Reactive updates
    this.authService.isLoggedIn$.subscribe((loggedIn) => (this.isLoggedIn = loggedIn));
    this.authService.role$.subscribe((role) => (this.role = role));
  }

  isLandingPage(): boolean {
    return this.currentRoute === '/';
  }

  isAuthPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }

  goToDashboard() {
    if (this.role === 'student') this.router.navigate(['/student/dashboard']);
    else if (this.role === 'author') this.router.navigate(['/author/dashboard']);
    else if (this.role === 'admin') this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
