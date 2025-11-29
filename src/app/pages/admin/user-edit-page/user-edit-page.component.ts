import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../entities/user/api/user.service';
import { UpdateUserDto } from '../../../entities/user/model/user.model';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [
    GrayLineComponent,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
  ],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.scss',
})
export class UserEditPageComponent implements OnInit {
  userForm;
  isLoading = false;
  error: string | null = null;
  isSubmitted = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      street: [''],
      city: [''],
      postalCode: [''],
      country: [''],
    });
  }

  get fc() {
    return {
      email: this.userForm.get('email')!,
      firstName: this.userForm.get('firstName')!,
      lastName: this.userForm.get('lastName')!,
      street: this.userForm.get('street')!,
      city: this.userForm.get('city')!,
      postalCode: this.userForm.get('postalCode')!,
      country: this.userForm.get('country')!,
    };
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isLoading = true;
      this.userService.getUserById(Number(this.userId)).subscribe({
        next: (user) => {
          this.userForm.patchValue({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            street: user.street,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
          });

          // Disable email field since it shouldn't be editable
          this.userForm.get('email')?.disable();
        },
        error: () => {
          this.error = 'Error loading user';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.userForm.invalid || !this.userId) return;
    this.isLoading = true;
    this.error = null;

    const dto: UpdateUserDto = {
      firstName: this.userForm.value.firstName || '',
      lastName: this.userForm.value.lastName || '',
      street: this.userForm.value.street || '',
      city: this.userForm.value.city || '',
      postalCode: this.userForm.value.postalCode || '',
      country: this.userForm.value.country || '',
    };

    this.userService.updateUser(Number(this.userId), dto).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: () => {
        this.error = 'Cannot update user';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
