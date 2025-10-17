// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // ❌ Not logged in
    if (!token) {
      this.router.navigate(['/']); // redirect to home
      return false;
    }

    // ❌ Role mismatch
    const expectedRole = route.data['role'] as string;
    if (expectedRole && role !== expectedRole) {
      this.router.navigate(['/']); // redirect to home
      return false;
    }

    return true; // ✅ allowed
  }
}
