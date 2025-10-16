import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.adminService.getAllStudents().subscribe(data => {
      this.students = data;
    });
  }

  onDeleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.adminService.deleteStudent(studentId).subscribe(() => {
        this.loadStudents(); // Refresh the list after deletion
      });
    }
  }
}