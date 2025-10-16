import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { AuthorManagementComponent } from '../author-management/author-management.component';
import { StudentManagementComponent } from '../student-management/student-management.component'; // ✅ NEW IMPORT

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    AuthorManagementComponent, 
    StudentManagementComponent // ✅ NEW COMPONENT ADDED TO IMPORTS
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'courses';
  courses: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getAllCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onPublish(courseId: number): void {
    if (confirm('Are you sure you want to publish this course?')) {
      this.adminService.publishCourse(courseId).subscribe(() => {
        this.loadCourses(); // Refresh the list
      });
    }
  }

  onDeleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.adminService.deleteCourse(courseId).subscribe(() => {
        this.loadCourses(); // Refresh the list
      });
    }
  }
}