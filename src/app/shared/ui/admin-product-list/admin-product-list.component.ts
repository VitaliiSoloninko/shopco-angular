import { Component, input, output } from '@angular/core';
import { AdminEntity } from '../../models/admin-entity.model';
import { AdminProductCardComponent } from '../admin-product-card/admin-product-card.component';

@Component({
  selector: 'app-admin-product-list',
  imports: [AdminProductCardComponent],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.scss',
})
export class AdminProductListComponent {
  items = input<AdminEntity[]>([]);
  title = input<string | undefined>(undefined);

  edit = output<AdminEntity>();
  delete = output<number>();
  imageClick = output<AdminEntity>();

  onEdit(entity: AdminEntity) {
    this.edit.emit(entity);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onImageClick(entity: AdminEntity) {
    this.imageClick.emit(entity);
  }
}
