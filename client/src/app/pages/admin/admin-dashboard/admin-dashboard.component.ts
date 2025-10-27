import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AuthorManagementComponent } from '../author-management/author-management.component';
import { StudentManagementComponent } from '../student-management/student-management.component';
import { ModalService } from '../../../shared/modal/modal.service';
import { CommonModalComponent } from '../../../shared/modal/common-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AuthorManagementComponent,
    StudentManagementComponent,
    CommonModalComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'courses';
  courses: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';

  isCourseEnrollmentModalVisible = false;
  selectedCourseForEnrollments: any = null;
  selectedCourseEnrollmentsList: any[] = [];

  constructor(private adminService: AdminService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = [...data];
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.modalService.open('Error', 'Failed to load courses.', 'error');
      }
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        (course.author?.name?.toLowerCase().includes(term))
    );
  }

  onPublish(courseId: number): void {
    this.modalService.open(
      'Confirm Publish',
      'Are you sure you want to publish this course?',
      'confirm',
      () => {
        this.adminService.publishCourse(courseId).subscribe({
          next: () => {
            this.modalService.open('Success', 'Course published successfully!', 'success');
            this.loadCourses();
          },
          error: (err) => {
            console.error('Error publishing course:', err);
            this.modalService.open('Error', 'Failed to publish course.', 'error');
          }
        });
      }
    );
  }

  onDeleteCourse(courseId: number): void {
    this.modalService.open(
      'Confirm Delete',
      'Are you sure you want to delete this course?',
      'confirm',
      () => {
        this.adminService.deleteCourse(courseId).subscribe({
          next: () => {
            this.modalService.open('Success', 'Course deleted successfully!', 'success');
            this.loadCourses();
          },
          error: (err) => {
            console.error('Error deleting course:', err);
            this.modalService.open('Error', 'Failed to delete course.', 'error');
          }
        });
      }
    );
  }

  onViewCourseEnrollments(course: any): void {
    this.selectedCourseForEnrollments = course;
    this.adminService.getCourseEnrollments(course.id).subscribe({
      next: (data) => {
        this.selectedCourseEnrollmentsList = data || [];
        this.isCourseEnrollmentModalVisible = true;
      },
      error: (err) => {
        console.error('Error loading course enrollments:', err);
        this.modalService.open('Error', 'Could not load enrollments for this course.', 'error');
      }
    });
  }

  closeCourseEnrollmentModal(): void {
    this.isCourseEnrollmentModalVisible = false;
    this.selectedCourseForEnrollments = null;
    this.selectedCourseEnrollmentsList = [];
  }
}
