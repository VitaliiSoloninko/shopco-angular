import { Component, signal } from '@angular/core';
import { TYPES } from '../../../data/types.data';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-types-page',
  imports: [GrayLineComponent, AdminEntityListComponent],
  templateUrl: './types-page.component.html',
  styleUrl: './types-page.component.scss',
})
export class TypesPageComponent {
  types = signal<AdminEntity[]>([...TYPES]);

  onEditType(type: AdminEntity) {
    console.log('Edit type:', type);
  }

  onDeleteType(typeId: number) {
    this.types.update((types) => types.filter((type) => type.id !== typeId));
    console.log('Delete type with id:', typeId);
  }

  onAddType() {
    console.log('Add new type');
  }
}
