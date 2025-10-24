import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor, *ngIf
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule], // Ensure CommonModule is imported
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  // ✅ ADDED properties to manage the modal popup state and data
  isModalVisible = false;
  selectedStudent: any = null;
  selectedStudentEnrollments: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.adminService.getAllStudents().subscribe({
        next: (data) => { this.students = data; },
        error: (err) => { console.error("Error loading students:", err); }
    });
  }

  onDeleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.adminService.deleteStudent(studentId).subscribe({
          next: () => { this.loadStudents(); },
          error: (err) => { console.error("Error deleting student:", err); }
      });
    }
  }

  // ✅ ADDED function to open the modal and fetch enrollments
  onViewEnrollments(student: any): void {
    this.selectedStudent = student; // Store which student was clicked
    // Call the service to get enrollments for this specific student
    this.adminService.getStudentEnrollments(student.id).subscribe({
        next: (data) => {
            console.log("Enrollments received:", data); // For debugging
            this.selectedStudentEnrollments = data; // Store the enrollments data
            this.isModalVisible = true; // Set the flag to show the modal
        },
        error: (err) => {
            console.error('Error fetching student enrollments:', err);
            alert('Could not load enrollments.'); // Inform the user
        }
    });
  }

  // ✅ ADDED function to close the modal
  closeModal(): void {
    this.isModalVisible = false; // Hide the modal
    this.selectedStudent = null; // Clear the selected student data
    this.selectedStudentEnrollments = []; // Clear the enrollments list
  }
}

