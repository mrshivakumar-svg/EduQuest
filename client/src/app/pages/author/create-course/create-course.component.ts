import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      thumbnailUrl: [''],
      expiryDate: [''],
      contents: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.courseId = id;
        this.loadCourseData(id);
      }
    });
  }

  get contentsControls() {
    return (this.courseForm.get('contents') as FormArray).controls;
  }

  addNewContent() {
    (this.courseForm.get('contents') as FormArray).push(
      this.fb.group({
        id: [null],
        title: ['', Validators.required],
        fileUrl: ['', Validators.required],
        contentType: ['video', Validators.required]
      })
    );
  }

  removeContent(index: number) {
    (this.courseForm.get('contents') as FormArray).removeAt(index);
  }

  private loadCourseData(id: string) {
    this.api.getCourseById(id).subscribe({
      next: (res: any) => {
        const course = res.course;
        if (!course) return;

        // Patch course info
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl,
          expiryDate: course.expiryDate ? course.expiryDate.split('T')[0] : ''
        });

        // Load existing contents
        const contentsArray = this.courseForm.get('contents') as FormArray;
        contentsArray.clear();
        course.contents.forEach((c: any) => {
          contentsArray.push(
            this.fb.group({
              id: [c.id],
              title: [c.title, Validators.required],
              fileUrl: [c.fileUrl, Validators.required],
              contentType: [c.contentType, Validators.required]
            })
          );
        });
      },
      error: err => console.error('Error loading course:', err)
    });
  }

  saveCourse() {
    if (!this.courseForm.valid) return;

    const courseData = { ...this.courseForm.value };
    const contentsArray = courseData.contents;
    delete courseData.contents;

    if (this.isEditMode && this.courseId) {
      // Update course info
      this.api.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          // Update existing contents & add new
          contentsArray.forEach((c: any) => {
            if (c.id) {
              this.api.updateCourseContent(c.id, c).subscribe();
            } else {
              this.api.addCourseContent(Number(this.courseId), c).subscribe();
            }
          });
          window.alert('Course and contents updated successfully! Pending admin approval.');
          this.router.navigate(['/author/dashboard']);
        },
        error: err => console.error(err)
      });
    } else {
      // Create new course
      this.api.createCourse(courseData).subscribe({
        next: (res: any) => {
          const newCourseId = res.course.id;
          contentsArray.forEach((c: any) => {
            this.api.addCourseContent(newCourseId, c).subscribe();
          });
          window.alert('Course created successfully!');
          this.router.navigate(['/author/dashboard']);
        },
        error: err => console.error(err)
      });
    }
  }
}
