import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngIf, *ngFor, [ngClass]
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import RouterLink for the back button
import { AdminService } from '../../services/admin.service'; // ✅ Use AdminService

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink], // Import CommonModule and RouterLink
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course: any; // Will hold the course data fetched from the backend
  isLoading = true; // Flag to show a loading message

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService // ✅ Inject AdminService
  ) { }

  ngOnInit(): void {
    // Get the course ID from the URL parameter
    const courseId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      // Call the AdminService to get the course details
      this.adminService.getCourseDetails(+courseId).subscribe({
        next: (data) => {
          this.course = data; // Store the fetched course data
          this.isLoading = false; // Turn off loading indicator
        },
        error: (err) => {
          console.error("Error fetching course details for admin:", err);
          this.isLoading = false; // Turn off loading indicator even if there's an error
        }
      });
    } else {
      console.error("Course ID not found in route parameters");
      this.isLoading = false;
    }
  }

  // NOTE: Student-specific methods like enroll() and openContent() are removed
  // as they are not needed for the admin view.
}

