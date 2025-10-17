import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      this.router.navigate(['/']); // not logged in
      return false;
    }

    // Check required role for this route
    const expectedRole = route.data['role'] as string;

    if (expectedRole && role !== expectedRole) {
      this.router.navigate(['/']); // role not allowed
      return false;
    }

    return true; // logged in and role matches
  }
}
