import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      this.isLoggedInSubject.next(!!token);
      this.roleSubject.next(role);
    }
  }

  login(token: string, role: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.isLoggedInSubject.next(true);
    this.roleSubject.next(role);
  }

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
  }
}
