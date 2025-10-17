import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service'; // ✅ CORRECTED: Use ApiService

@Component({
  selector: 'app-author-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './author-management.component.html',
  styleUrls: ['./author-management.component.scss']
})
export class AuthorManagementComponent implements OnInit {
  authors: any[] = [];
  authorForm!: FormGroup;

  constructor(
    private apiService: ApiService, // ✅ CORRECTED: Use ApiService
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.apiService.getAllAuthors().subscribe(data => { // ✅ CORRECTED
      this.authors = data;
    });
  }

  onCreateAuthor(): void {
    if (this.authorForm.valid) {
      this.apiService.createAuthor(this.authorForm.value).subscribe({ // ✅ CORRECTED
        next: () => {
          this.authorForm.reset();
          this.loadAuthors();
        },
        error: (err) => {
          console.error('Failed to create author:', err); // Added error logging
        }
      });
    }
  }

  onDeleteAuthor(authorId: number): void {
    if (confirm('Are you sure you want to delete this author?')) {
      this.apiService.deleteAuthor(authorId).subscribe(() => this.loadAuthors()); // ✅ CORRECTED
    }
  }
}