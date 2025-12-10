import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserState } from '../../../entities/user/model';
import { AvatarComponent } from '../../../entities/user/ui/avatar/avatar.component';

@Component({
  selector: 'app-profile-page',
  imports: [AvatarComponent, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  userState = inject(UserState);

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
}
