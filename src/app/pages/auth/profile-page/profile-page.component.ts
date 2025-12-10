import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../entities/user/ui/avatar/avatar.component';
import { UserState } from '../../../entities/user/model';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, AvatarComponent, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  userState = inject(UserState);

  ngOnInit(): void {
    // Load mock user for development/demo
    this.userState.loadMockUser();
  }
}
