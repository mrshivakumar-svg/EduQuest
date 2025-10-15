import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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
