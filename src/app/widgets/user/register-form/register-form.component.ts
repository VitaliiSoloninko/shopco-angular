import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../entities/user/api/auth.service';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, TextInputComponent, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  isLoading = false;
  error: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get fc() {
    return {
      firstName: this.registerForm.get('firstName')!,
      lastName: this.registerForm.get('lastName')!,
      email: this.registerForm.get('email')!,
      password: this.registerForm.get('password')!,
    };
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.error = null;

    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        // После успешной регистрации переходим на страницу логина
        this.router.navigate(['/login'], {
          queryParams: { message: 'Registration successful! Please log in.' },
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.error =
          err?.error?.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      },
    });
  }
}
