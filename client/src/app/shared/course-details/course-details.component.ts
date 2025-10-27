import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalService } from '../modal/modal.service';
import { CommonModalComponent } from '../modal/common-modal.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, CommonModalComponent]
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  courseId!: number;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCourse();
  }

  loadCourse(): void {
    this.api.getCourseDetailsByRole(this.courseId).subscribe({
      next: (res) => (this.course = res),
      error: (err) => {
        console.error('Error loading course details:', err);
        this.modalService.open('Error', 'Failed to load course details', 'error');
      }
    });
  }

  enroll(): void {
    this.api.enrollInCourse(this.courseId).subscribe({
      next: () => {
        this.modalService.open('Success', 'Successfully enrolled!', 'success');
        this.course.isEnrolled = true; // update UI immediately
      },
      error: (err) => {
        this.modalService.open(
          'Error',
          err.error?.message || 'Error enrolling in course',
          'error'
        );
      }
    });
  }

  openContent(contentId: number): void {
    this.api.getCourseContent(this.courseId, contentId).subscribe({
      next: (res) => {
        if (res.fileUrl) window.open(res.fileUrl, '_blank');
        else this.modalService.open('Info', 'No file found for this content', 'info');
      },
      error: (err) => {
        this.modalService.open('Error', 'Enroll to open content', 'error');
      }
    });
  }
}
