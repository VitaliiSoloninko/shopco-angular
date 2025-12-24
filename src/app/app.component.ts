import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './entities/user/api/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    // Initialize authentication state on app start
    // Try to refresh access token from httpOnly cookie
    this.authService.initializeAuth().subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          console.log('✅ Session restored from refresh token');
          // Load user profile after successful token refresh
          this.authService.refreshUserData().subscribe({
            next: () => console.log('User profile loaded'),
            error: (error) =>
              console.error('Failed to load user profile:', error),
          });
        } else {
          console.log('No valid session, user needs to login');
        }
      },
      error: (error) => {
        console.error('Auth initialization failed:', error);
      },
    });
  }
}
