import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor, *ngIf
import { AdminService } from '../../../services/admin.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { CommonModalComponent } from '../../../shared/modal/common-modal.component';
@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, CommonModalComponent], // Import modal component
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  isModalVisible = false;
  selectedStudent: any = null;
  selectedStudentEnrollments: any[] = [];
  constructor(private adminService: AdminService, private modalService: ModalService) {}
  ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents(): void {
    this.adminService.getAllStudents().subscribe({
      next: (data) => { this.students = data; },
      error: (err) => {
        console.error("Error loading students:", err);
        this.modalService.open('Error', 'Failed to load students.', 'error');
      }
    });
  }
  // :white_check_mark: Delete student with confirmation modal
  onDeleteStudent(studentId: number): void {
    this.modalService.open(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      'confirm',
      () => {
        // Callback runs if user clicks "Yes"
        this.adminService.deleteStudent(studentId).subscribe({
          next: () => {
            this.modalService.open('Success', 'Student deleted successfully!', 'success');
            this.loadStudents();
          },
          error: (err) => {
            console.error("Error deleting student:", err);
            this.modalService.open('Error', 'Failed to delete student.', 'error');
          }
        });
      }
    );
  }
  // :white_check_mark: View enrollments in modal
  onViewEnrollments(student: any): void {
    this.selectedStudent = student;
    this.adminService.getStudentEnrollments(student.id).subscribe({
      next: (data) => {
        this.selectedStudentEnrollments = data;
        this.isModalVisible = true; // Show modal
      },
      error: (err) => {
        console.error('Error fetching student enrollments:', err);
        this.modalService.open('Error', 'Could not load enrollments.', 'error');
      }
    });
  }
  // :white_check_mark: Close the enrollments modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedStudent = null;
    this.selectedStudentEnrollments = [];
  }
}