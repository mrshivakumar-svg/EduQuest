import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],  // ✅ added RouterLink
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      role: ['student'],
    });
  }

  submitRegister() {
    this.api.registerUser(this.registerForm.value).subscribe({
      next: (res) => {
        alert('Registration successful! You can now login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = err.error.message || 'Registration failed';
      },
    });
  }
}
