import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message = ''; // show custom error messages
  showPassword = false; // 👁️ toggle visibility

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  // 👁️ toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔑 login handler
  onLogin(): void {
    this.message = ''; // clear previous error message
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      this.message = 'Please enter both email and password.';
      return;
    }

    this.api.loginUser({ email, password }).subscribe({
      next: (res) => {
        // login success
        this.authService.login(res.token, res.user.role);
        const redirectUrl = this.route.snapshot.queryParamMap.get('redirectTo');
        if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          if (res.user.role === 'student') this.router.navigate(['/student/dashboard']);
          else if (res.user.role === 'author') this.router.navigate(['/author/dashboard']);
          else this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);

        // Differentiate error messages
        if (err.status === 404) {
          this.message = 'No account found with this email.';
        } else if (err.status === 400) {
          this.message = 'Incorrect password. Please try again.';
        } else {
          this.message = 'Login failed. Please try again later.';
        }
      },
    });
  }
}
