// src/app/pages/create-course/create-course.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  message = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required],
      thumbnailUrl: ['']
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.message = '⚠️ Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.api.createCourse(this.courseForm.value).subscribe({
      next: (res) => {
        this.message = '✅ Course created successfully, pending admin approval!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/author-dashboard']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Failed to create course. Please try again.';
        this.loading = false;
      }
    });
  }
}
