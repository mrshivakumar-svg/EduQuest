import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms'; // ⚠️ Required for [(ngModel)] if you add editing inputs

// 1. Define an interface for better type safety and to ensure 'createdAt' exists
interface Author {
  name: string;
  email: string;
  createdAt: string; // The property for the date binding
  courses: any[]; // Assuming an array of courses
  // Add other properties from your API response here
}

@Component({
  selector: 'app-author-profile',
  standalone: true,
  // ⚠️ Added FormsModule for editing features later (e.g., [(ngModel)])
  imports: [CommonModule, HttpClientModule, FormsModule], 
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.scss'],
  providers: [ApiService],
})
export class AuthorProfileComponent implements OnInit {
  // Use the interface
  author: Author | null = null; 
  loading = true;
  
  // 2. Added property for edit mode, required by the HTML buttons
  isEditing: boolean = false; 

  // You might need these for avatar functionality
  profileImageUrl: string | null = null;
  // fileInput: ElementRef | undefined; // You'd need to inject ElementRef for this

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    // ⚠️ Note: Your API call assumes getAuthorProfile() returns the 'Author' object
    this.api.getAuthorProfile().subscribe({
      next: (res: any) => {
        // Ensure the response structure matches the 'Author' interface
        this.author = res as Author; 
        this.loading = false;
        console.log('Author Profile:', res);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
        // Optionally, set a mock author for UI testing if loading fails
        this.author = { 
          name: 'Fallback Author', 
          email: 'error@example.com', 
          createdAt: new Date().toISOString(), 
          courses: [] 
        } as Author;
      },
    });
  }

  // 3. Method to toggle the edit state
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    // When entering edit mode, you might want to create a copy of the data
    // to allow cancellation, but for now, we just toggle.
    if (this.isEditing) {
      console.log('Entering Edit Mode');
    }
  }

  // 4. Placeholder methods for editing actions
  cancelEdit(): void {
    this.isEditing = false;
    // TODO: Reset profile data back to the original fetched state
    console.log('Edit cancelled.');
  }

  saveProfile(): void {
    // TODO: Implement logic to send updated 'author' data to the backend via this.api
    this.isEditing = false;
    console.log('Profile saved.');
  }

  // 5. Placeholder methods for avatar functionality (required by the HTML logic)
  getInitial(name: string): string {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  // Placeholder function to assign a color class based on the author's name
  getAvatarColorClass(name: string): string {
    if (!name) return 'avatar-bg-1';
    const charCode = name.charCodeAt(0);
    const colorIndex = charCode % 5; // 5 is the number of defined color classes (1 to 5)
    return `avatar-bg-${colorIndex + 1}`;
  }

  // 6. Existing method
  goBack(): void {
    this.router.navigate(['/author/dashboard']);
  }
}