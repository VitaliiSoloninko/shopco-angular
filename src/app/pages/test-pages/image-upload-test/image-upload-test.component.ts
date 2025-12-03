import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ImageUploadComponent,
  ImageUploadError,
} from '../../../shared/ui/image-upload/image-upload.component';

@Component({
  selector: 'app-image-upload-test',
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './image-upload-test.component.html',
  styleUrl: './image-upload-test.component.scss',
})
export class ImageUploadTestComponent {
  testForm;
  isSubmitted = false;
  uploadError: ImageUploadError | null = null;

  constructor(private fb: FormBuilder) {
    this.testForm = this.fb.group({
      title: ['', [Validators.required]],
      image: [null, [Validators.required]],
    });
  }

  onImageSelected(file: File | null): void {
    console.log('File selected:', file);
  }

  onImageError(error: ImageUploadError | null): void {
    this.uploadError = error;
    console.log('Upload error:', error);
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.testForm.valid) {
      console.log('Form submitted:', this.testForm.value);
      alert('Form is valid and ready to submit!');
    } else {
      console.log('Form is invalid');
    }
  }

  get fc() {
    return {
      title: this.testForm.get('title')! as FormControl,
      image: this.testForm.get('image')! as FormControl,
    };
  }
}
