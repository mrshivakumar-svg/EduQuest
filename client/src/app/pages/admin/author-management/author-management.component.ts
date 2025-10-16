import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-author-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './author-management.component.html',
  styleUrls: ['./author-management.component.scss']
})
export class AuthorManagementComponent implements OnInit {
  authors: any[] = [];
  authorForm!: FormGroup;

  constructor(
    private adminService: AdminService,
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
    this.adminService.getAllAuthors().subscribe(data => {
      this.authors = data;
    });
  }

  onCreateAuthor(): void {
    if (this.authorForm.valid) {
      this.adminService.createAuthor(this.authorForm.value).subscribe(() => {
        this.authorForm.reset();
        this.loadAuthors();
      });
    }
  }

  onDeleteAuthor(authorId: number): void {
    if (confirm('Are you sure you want to delete this author?')) {
      this.adminService.deleteAuthor(authorId).subscribe(() => this.loadAuthors());
    }
  }
}