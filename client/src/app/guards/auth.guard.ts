import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Only check localStorage if we’re in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      // ❌ Not logged in
      if (!token) {
        this.router.navigate(['/']);
        return false;
      }

      // ❌ Role mismatch
      const expectedRole = route.data['role'] as string;
      if (expectedRole && role !== expectedRole) {
        this.router.navigate(['/']);
        return false;
      }

      return true; // ✅ allowed
    }

    // SSR fallback (deny access)
    return false;
  }
}
