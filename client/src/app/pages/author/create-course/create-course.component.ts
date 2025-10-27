import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/modal/modal.service';
import { CommonModalComponent } from '../../../shared/modal/common-modal.component';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonModalComponent],
  providers: [ApiService]
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
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

  addNewContent(): void {
    (this.courseForm.get('contents') as FormArray).push(
      this.fb.group({
        id: [null],
        title: ['', Validators.required],
        fileUrl: ['', Validators.required],
        contentType: ['video', Validators.required]
      })
    );
  }

  removeContent(index: number): void {
    (this.courseForm.get('contents') as FormArray).removeAt(index);
  }

  private loadCourseData(id: string): void {
    this.api.getCourseById(id).subscribe({
      next: (res: any) => {
        const course = res.course;
        if (!course) return;

        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl,
          expiryDate: course.expiryDate ? course.expiryDate.split('T')[0] : ''
        });

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
      error: err => {
        console.error('Error loading course:', err);
        this.modalService.open('Error', 'Failed to load course data.', 'error');
      }
    });
  }

  saveCourse(): void {
    console.log('🟢 Save course clicked', this.courseForm.value);

    // ✅ Check if form is valid
    if (!this.courseForm.valid) {
      this.modalService.open('Error', 'Please fill all required course fields.', 'error');
      return;
    }

    // ✅ Check if at least one content is added
    const contentsArray = this.courseForm.get('contents') as FormArray;
    if (contentsArray.length === 0) {
      this.modalService.open('Error', 'Please add at least one course content before saving.', 'error');
      return;
    }

    const courseData = { ...this.courseForm.value };
    const contents = courseData.contents;
    delete courseData.contents;

    if (this.isEditMode && this.courseId) {
      // Update course
      this.api.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          contents.forEach((c: any) => {
            if (c.id) {
              this.api.updateCourseContent(c.id, c).subscribe();
            } else {
              this.api.addCourseContent(Number(this.courseId), c).subscribe();
            }
          });
          this.modalService.open('Success', 'Course and contents updated successfully!', 'success');
          this.router.navigate(['/author/dashboard']);
        },
        error: err => {
          console.error(err);
          this.modalService.open('Error', 'Failed to update course.', 'error');
        }
      });
    } else {
      // Create new course
      this.api.createCourse(courseData).subscribe({
        next: (res: any) => {
          const newCourseId = res.course.id;
          contents.forEach((c: any) => {
            this.api.addCourseContent(newCourseId, c).subscribe();
          });
          this.modalService.open('Success', 'Course created successfully!', 'success');
          this.router.navigate(['/author/dashboard']);
        },
        error: err => {
          console.error(err);
          this.modalService.open('Error', 'Failed to create course.', 'error');
        }
      });
    }
  }
}
