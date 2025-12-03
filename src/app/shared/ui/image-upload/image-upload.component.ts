import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export interface ImageUploadError {
  type: 'size' | 'format' | 'upload';
  message: string;
}

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
})
export class ImageUploadComponent implements ControlValueAccessor {
  label = input('Upload Image');
  maxSizeInMB = input(5);
  acceptedFormats = input(['jpg', 'jpeg', 'png', 'gif']);
  showErrorsWhen = input(false);
  control = input<FormControl | undefined>(undefined);

  fileSelected = output<File | null>();
  error = output<ImageUploadError | null>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errors: ImageUploadError[] = [];
  isDragOver = false;

  private onChange = (value: File | null) => {};
  private onTouched = () => {};

  // ControlValueAccessor implementation
  writeValue(value: File | null): void {
    this.selectedFile = value;
    if (value) {
      this.createPreview(value);
    } else {
      this.clearPreview();
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    this.clearErrors();

    if (!this.validateFile(file)) {
      return;
    }

    this.selectedFile = file;
    this.createPreview(file);
    this.onChange(file);
    this.onTouched();
    this.fileSelected.emit(file);
  }

  private validateFile(file: File): boolean {
    // Проверка размера файла
    const maxSizeInBytes = this.maxSizeInMB() * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const error: ImageUploadError = {
        type: 'size',
        message: `File size must be less than ${this.maxSizeInMB}MB`,
      };
      this.addError(error);
      return false;
    }

    // Проверка формата файла
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !this.acceptedFormats().includes(fileExtension)) {
      const error: ImageUploadError = {
        type: 'format',
        message: `Only ${this.acceptedFormats().join(', ')} files are allowed`,
      };
      this.addError(error);
      return false;
    }

    // Проверка MIME типа
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      const error: ImageUploadError = {
        type: 'format',
        message: 'Invalid file type',
      };
      this.addError(error);
      return false;
    }

    return true;
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private clearPreview(): void {
    this.previewUrl = null;
  }

  private addError(error: ImageUploadError): void {
    this.errors.push(error);
    this.error.emit(error);
  }

  private clearErrors(): void {
    this.errors = [];
    this.error.emit(null);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.clearPreview();
    this.clearErrors();
    this.onChange(null);
    this.onTouched();
    this.fileSelected.emit(null);
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  get shouldShowErrors(): boolean {
    return this.showErrorsWhen() && this.hasErrors;
  }

  get acceptAttribute(): string {
    return this.acceptedFormats()
      .map((f) => '.' + f)
      .join(',');
  }
}
