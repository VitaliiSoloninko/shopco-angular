import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeService } from '../../../entities/type/api/type.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-type-edit-page',
  standalone: true,
  imports: [
    GrayLineComponent,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
  ],
  templateUrl: './type-edit-page.component.html',
  styleUrl: './type-edit-page.component.scss',
})
export class TypeEditPageComponent implements OnInit {
  typeForm;
  isLoading = false;
  error: string | null = null;
  isSubmitted = false;
  typeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private typeService: TypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  get fc() {
    return {
      name: this.typeForm.get('name')!,
    };
  }

  ngOnInit() {
    this.typeId = this.route.snapshot.paramMap.get('id');
    if (this.typeId) {
      this.isLoading = true;
      this.typeService.getType(this.typeId).subscribe({
        next: (type) => {
          this.typeForm.patchValue({ name: type.name });
        },
        error: () => {
          this.error = 'Error loading type';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.typeForm.invalid || !this.typeId) return;
    this.isLoading = true;
    this.error = null;
    const dto = { name: this.typeForm.value.name || '' };
    this.typeService.updateType(this.typeId, dto).subscribe({
      next: () => this.router.navigate(['/admin/types']),
      error: () => {
        this.error = 'Cannot update type, maybe it already exists';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
