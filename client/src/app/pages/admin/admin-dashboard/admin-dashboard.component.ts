import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ ADD THIS IMPORT
import { ApiService } from '../../../services/api.service'; // Use your correct service name/path
import { AuthorManagementComponent } from '../author-management/author-management.component'; // ✅ ADD THIS IMPORT
import { StudentManagementComponent } from '../student-management/student-management.component'; // ✅ ADD THIS IMPORT

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,                 // ✅ ADD THIS
    AuthorManagementComponent,    // ✅ ADD THIS
    StudentManagementComponent    // ✅ ADD THIS
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'courses';
  courses: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.apiService.adminGetAllCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onPublish(courseId: number): void {
    if (confirm('Are you sure you want to publish this course?')) {
      this.apiService.publishCourse(courseId).subscribe(() => this.loadCourses());
    }
  }

  onDeleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.apiService.adminDeleteCourse(courseId).subscribe(() => this.loadCourses());
    }
  }
}