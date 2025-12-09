import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../entities/user/api/auth.service';
import { UserState } from '../../../entities/user/model/user.state';
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
  private userState = inject(UserState);
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
        // Save token in UserState
        this.userState.setAccessToken(response.access_token);
        this.isLoading = false;
        console.log('Registration successful:', response);
        // After successful registration, the user is automatically authenticated
        // Redirect to the home page
        this.router.navigate(['/']);
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
