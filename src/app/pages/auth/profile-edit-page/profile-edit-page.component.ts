import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserState } from '../../../entities/user/model';
import { ProfileFormComponent } from '../../../entities/user/ui/profile-form/profile-form.component';

@Component({
  selector: 'app-profile-edit-page',
  standalone: true,
  imports: [ProfileFormComponent],
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.scss'],
})
export class ProfileEditPageComponent implements OnInit {
  userState = inject(UserState);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    try {
      await this.userState.refreshUserData();
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
