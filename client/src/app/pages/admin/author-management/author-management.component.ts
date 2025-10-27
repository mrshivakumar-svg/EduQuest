import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-author-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './author-management.component.html',
  styleUrls: ['./author-management.component.scss']
})
export class AuthorManagementComponent implements OnInit {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  authorForm!: FormGroup;
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.apiService.getAllAuthors().subscribe(data => {
      this.authors = data;
      this.filteredAuthors = [...data];
    });
  }

  onCreateAuthor(): void {
    if (this.authorForm.valid) {
      this.apiService.createAuthor(this.authorForm.value).subscribe({
        next: () => {
          this.authorForm.reset();
          this.loadAuthors();
        },
        error: (err) => {
          console.error('Failed to create author:', err);
        }
      });
    }
  }

  onDeleteAuthor(authorId: number): void {
    if (confirm('Are you sure you want to delete this author?')) {
      this.apiService.deleteAuthor(authorId).subscribe(() => this.loadAuthors());
    }
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAuthors = this.authors.filter(
      (author) =>
        author.name?.toLowerCase().includes(term) ||
        author.email?.toLowerCase().includes(term)
    );
  }
}
