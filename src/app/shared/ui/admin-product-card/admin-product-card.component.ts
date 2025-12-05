import { Component, input, output } from '@angular/core';
import { AdminEntity } from '../../models/admin-entity.model';

@Component({
  selector: 'app-admin-product-card',
  imports: [],
  templateUrl: './admin-product-card.component.html',
  styleUrl: './admin-product-card.component.scss',
})
export class AdminProductCardComponent {
  entity = input<AdminEntity>({} as AdminEntity);
  showImage = input<boolean>(false);

  edit = output<AdminEntity>();
  delete = output<number>();
  imageClick = output<AdminEntity>();

  onEdit() {
    this.edit.emit(this.entity());
  }

  onDelete() {
    this.delete.emit(this.entity().id);
  }

  onImageClick() {
    this.imageClick.emit(this.entity());
  }
}
