import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // For the [routerLink] directive
import { AdminService } from '../../../services/admin.service';
import { AuthorManagementComponent } from '../author-management/author-management.component';
import { StudentManagementComponent } from '../student-management/student-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngIf, *ngFor, [ngClass]
    RouterLink,   // Needed for the [routerLink] View button
    AuthorManagementComponent, // Needed to display <app-author-management>
    StudentManagementComponent // Needed to display <app-student-management>
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'courses'; // Default tab
  courses: any[] = []; // Array to hold the course list

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCourses(); // Load courses when the component initializes
  }

  // Fetches the list of all courses from the backend
  loadCourses(): void {
    this.adminService.getAllCourses().subscribe(data => {
      this.courses = data;
    });
  }

  // Called when the "Publish" button is clicked
  onPublish(courseId: number): void {
    if (confirm('Are you sure you want to publish this course?')) {
      this.adminService.publishCourse(courseId).subscribe(() => {
        this.loadCourses(); // Refresh the list after publishing
      });
    }
  }

  // Called when the "Delete" button is clicked
  onDeleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.adminService.deleteCourse(courseId).subscribe(() => {
        this.loadCourses(); // Refresh the list after deleting
      });
    }
  }
}

