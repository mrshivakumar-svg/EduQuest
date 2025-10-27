import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ModalService } from '../../shared/modal/modal.service';

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
  showPassword = false; 

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private modalService: ModalService) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      role: ['student'],
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitRegister() {
    this.api.registerUser(this.registerForm.value).subscribe({
      next: (res) => {
        this.modalService.open('Registration successful! You can now login.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.modalService.open(err.error.message || 'Registration failed', 'error');
      },
    });
  }
}
