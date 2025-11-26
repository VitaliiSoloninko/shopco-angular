import { Component, signal } from '@angular/core';
import { USERS } from '../../../data/users.data';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-users-page',
  imports: [GrayLineComponent, AdminEntityListComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  users = signal<AdminEntity[]>(
    USERS.map((user) => ({
      ...user,
      name: `${user.firstName} ${user.lastName}`,
    }))
  );

  onEditUser(user: AdminEntity) {
    console.log('Edit user:', user);
  }

  onDeleteUser(userId: number) {
    this.users.update((users) => users.filter((user) => user.id !== userId));
    console.log('Delete user with id:', userId);
  }

  onAddUser() {
    console.log('Add new user');
  }
}
