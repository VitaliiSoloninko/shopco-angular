import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartState } from '../../../entities/cart/model/cart.state';
import { AuthService } from '../../../entities/user/api/auth.service';
import { UserState } from '../../../entities/user/model/user.state';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, TextInputComponent, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  // UI state
  isLoading = false;
  error: string | null = null;

  private authService = inject(AuthService);
  private userState = inject(UserState);
  private cartState = inject(CartState);
  private router = inject(Router);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get fc() {
    return {
      email: this.loginForm.get('email')!,
      password: this.loginForm.get('password')!,
    };
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save token in UserState
        this.userState.setAccessToken(response.access_token);

        // Sync cart from memory to backend
        this.cartState.syncCartAfterLogin();

        this.isLoading = false;
        // navigate to home after successful login
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error =
          err?.error?.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      },
    });
  }
}
