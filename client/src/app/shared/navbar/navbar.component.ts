import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    // Track route changes
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  // Route helpers
  isLandingPage(): boolean {
    return this.currentRoute === '/';
  }

  isAuthPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }

  logout() {
    // Clear session and redirect
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
