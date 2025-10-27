import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Needed for [routerLink]
import { AdminService } from '../../../services/admin.service';
import { AuthorManagementComponent } from '../author-management/author-management.component';
import { StudentManagementComponent } from '../student-management/student-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AuthorManagementComponent,
    StudentManagementComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'courses';
  courses: any[] = [];

  // ✅ ADDED properties for the course enrollment modal
  isCourseEnrollmentModalVisible = false;
  selectedCourseForEnrollments: any = null;
  selectedCourseEnrollmentsList: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getAllCourses().subscribe({
      next: (data) => { this.courses = data; },
      error: (err) => { console.error("Error loading courses:", err); }
    });
  }

  onPublish(courseId: number): void {
    if (confirm('Are you sure you want to publish this course?')) {
      this.adminService.publishCourse(courseId).subscribe({
        next: () => { this.loadCourses(); },
        error: (err) => { console.error("Error publishing course:", err); }
      });
    }
  }

  onDeleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.adminService.deleteCourse(courseId).subscribe({
        next: () => { this.loadCourses(); },
        error: (err) => { console.error("Error deleting course:", err); }
      });
    }
  }

  // ✅ ADDED function to open the course enrollment modal
  onViewCourseEnrollments(course: any): void {
    this.selectedCourseForEnrollments = course;
    this.adminService.getCourseEnrollments(course.id).subscribe({
      next: (data) => {
        this.selectedCourseEnrollmentsList = data;
        this.isCourseEnrollmentModalVisible = true;
      },
      error: (err) => {
        console.error("Error loading course enrollments:", err);
        alert("Could not load enrollments for this course.");
      }
    });
  }

  // ✅ ADDED function to close the course enrollment modal
  closeCourseEnrollmentModal(): void {
    this.isCourseEnrollmentModalVisible = false;
    this.selectedCourseForEnrollments = null;
    this.selectedCourseEnrollmentsList = [];
  }
}

