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
  message = '';

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

  onLogin() {
    this.api.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
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
        this.message = err.error?.message || 'Login failed';
      },
    });
  }
}
