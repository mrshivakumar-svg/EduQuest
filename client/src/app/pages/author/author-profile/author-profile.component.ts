import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-author-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.scss'],
  providers: [ApiService],
})
export class AuthorProfileComponent implements OnInit {
  author: any;
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAuthorProfile().subscribe({
      next: (res) => {
        this.author = res;
        this.loading = false;
        console.log('Author Profile:', res);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/author/dashboard']);
  }
}
