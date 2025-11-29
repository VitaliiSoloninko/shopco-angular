import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserDto } from '../../../data/users.data';
import { UserService } from '../../../entities/user/api/user.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [GrayLineComponent, ReactiveFormsModule, TextInputComponent],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss',
})
export class UserCreatePageComponent {
  userForm;
  isSubmitted = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      street: [''],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      role: ['user', [Validators.required]],
    });
  }

  get fc() {
    return {
      email: this.userForm.get('email')!,
      password: this.userForm.get('password')!,
      firstName: this.userForm.get('firstName')!,
      lastName: this.userForm.get('lastName')!,
      street: this.userForm.get('street')!,
      city: this.userForm.get('city')!,
      postalCode: this.userForm.get('postalCode')!,
      country: this.userForm.get('country')!,
      role: this.userForm.get('role')!,
    };
  }

  submit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) return;
    this.isLoading = true;
    this.error = null;

    const dto: CreateUserDto = {
      email: this.userForm.value.email || '',
      password: this.userForm.value.password || '',
      firstName: this.userForm.value.firstName || '',
      lastName: this.userForm.value.lastName || '',
      street: this.userForm.value.street || '',
      city: this.userForm.value.city || '',
      postalCode: this.userForm.value.postalCode || '',
      country: this.userForm.value.country || '',
      role: (this.userForm.value.role || 'user') as 'user' | 'admin',
    };

    this.userService.createUser(dto).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: () => {
        this.error = 'Cannot create user, maybe email already exists';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
