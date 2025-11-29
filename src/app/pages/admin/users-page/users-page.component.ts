import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../entities/user/api/user.service';
import { UserProfile } from '../../../entities/user/model/user.model';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AddButtonComponent } from '../../../shared/ui/add-button/add-button.component';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    GrayLineComponent,
    AdminEntityListComponent,
    ModalComponent,
    LoaderComponent,
    AddButtonComponent,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  users: UserProfile[] = [];
  adminEntities: AdminEntity[] = [];
  userService = inject(UserService);
  router = inject(Router);
  loading = false;
  showConfirm = false;
  userIdToDelete: number | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.adminEntities = users.map((u) => ({
          id: u.id,
          name: `${u.fullName} (${u.email})`,
        }));
      },
      error: () => {},
      complete: () => {
        this.loading = false;
      },
    });
  }

  onDeleteUser(userId: number) {
    this.userIdToDelete = userId;
    this.showConfirm = true;
  }

  onConfirm() {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(() => {
        this.loadUsers();
        this.showConfirm = false;
        this.userIdToDelete = null;
      });
    }
  }

  onCancel() {
    this.showConfirm = false;
    this.userIdToDelete = null;
  }

  onAddUser() {
    this.router.navigate(['admin/users/create']);
  }

  onEditUser(entity: AdminEntity) {
    this.router.navigate(['admin/users/edit', entity.id]);
  }
}
