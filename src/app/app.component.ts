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
    this.authService.initializeAuth().subscribe({
      next: (isAuthenticated) => {
        console.log('Auth initialized:', isAuthenticated);
      },
      error: (error) => {
        console.error('Auth initialization failed:', error);
      },
    });
  }
}
