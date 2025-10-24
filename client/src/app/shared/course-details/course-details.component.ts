import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  imports: [CommonModule, HttpClientModule]
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  courseId!: number;
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCourse();
  }
  loadCourse(): void {
    this.api.getCourseDetails(this.courseId).subscribe({
      next: (res) => (this.course = res),
      error: (err) => console.error('Error loading course details:', err)
    });
  }
  enroll(): void {
    this.api.enrollInCourse(this.courseId).subscribe({
      next: () => alert('Successfully enrolled!'),
      error: (err) => alert(err.error?.message || 'Error enrolling')
    });
  }
  openContent(contentId: number): void {
    this.api.getCourseContent(this.courseId, contentId).subscribe({
      next: (res) => {
        if (res.fileUrl) window.open(res.fileUrl, '_blank');
        else alert('No file found for this content');
      },
      error: (err) => alert('Error opening content')
    });
  }
}