import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Still needed

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Make sure both are here
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profile: any = null;
  originalProfile: any = null;
  loading = true;
  coursesCount = 0;

  isEditing = false;
  profileImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  // Define the avatar background color classes
  private avatarColors = [
    'avatar-bg-1', 
    'avatar-bg-2', 
    'avatar-bg-3', 
    'avatar-bg-4', 
    'avatar-bg-5'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.fetchEnrolledCourses();
  }

  fetchProfile(): void {
    this.api.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.originalProfile = { ...res };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  fetchEnrolledCourses(): void {
    this.api.getMyEnrollments().subscribe({
      next: (res: any) => {
        if (res && typeof res.total === 'number') {
          this.coursesCount = res.total;
        } else if (Array.isArray(res.enrollments)) {
          this.coursesCount = res.enrollments.length;
        } else {
          this.coursesCount = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching enrolled courses:', err);
        this.coursesCount = 0;
      }
    });
  }

  // --- Edit Mode Methods ---

  toggleEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profile = { ...this.originalProfile };
    this.profileImageUrl = null;
    this.selectedFile = null;
  }

  saveProfile(): void {
    console.log('Saving profile:', this.profile);
    if (this.selectedFile) {
      console.log('Uploading new image:', this.selectedFile.name);
    }
    
    this.originalProfile = { ...this.profile };
    if (this.profileImageUrl) {
      this.originalProfile.avatarUrl = this.profileImageUrl;
    }
    this.isEditing = false;
    this.selectedFile = null;
  }

  // --- File Upload Methods ---

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  // --- NEW: Avatar Helper Methods ---

  /**
   * Gets the first initial of the name.
   */
  getInitial(name: string): string {
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }
    return '?'; // Fallback
  }

  /**
   * Assigns a consistent background color class based on the name.
   */
  getAvatarColorClass(name: string): string {
    if (!name || name.length === 0) {
      return this.avatarColors[0];
    }
    // Use the char code of the first letter to pick a color
    const index = name.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[index];
  }
}