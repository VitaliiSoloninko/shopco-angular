import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileFormComponent } from '../../../entities/user/ui/profile-form/profile-form.component';
import { UserState } from '../../../entities/user/model';

@Component({
  selector: 'app-profile-edit-page',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent],
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.scss'],
})
export class ProfileEditPageComponent implements OnInit {
  userState = inject(UserState);
  private router = inject(Router);

  ngOnInit(): void {
    // Load mock user for development/demo
    this.userState.loadMockUser();
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
