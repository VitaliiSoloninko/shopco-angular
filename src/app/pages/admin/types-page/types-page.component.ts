import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeService } from '../../../entities/type/api/type.service';
import { Type } from '../../../entities/type/model/type';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AddButtonComponent } from '../../../shared/ui/add-button/add-button.component';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-types-page',
  imports: [
    CommonModule,
    GrayLineComponent,
    AdminEntityListComponent,
    ModalComponent,
    LoaderComponent,
    AddButtonComponent,
  ],
  templateUrl: './types-page.component.html',
  styleUrl: './types-page.component.scss',
})
export class TypesPageComponent implements OnInit {
  types: Type[] = [];
  adminEntities: AdminEntity[] = [];
  typeService = inject(TypeService);
  router = inject(Router);
  loading = false;
  showConfirm = false;
  typeIdToDelete: number | null = null;

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.loading = true;
    this.typeService.getTypes().subscribe({
      next: (types) => {
        this.types = types;
        this.adminEntities = types.map((t) => ({ id: t.id!, name: t.name }));
      },
      error: () => {},
      complete: () => {
        this.loading = false;
      },
    });
  }

  onDeleteType(typeId: number) {
    this.typeIdToDelete = typeId;
    this.showConfirm = true;
  }

  onConfirm() {
    if (this.typeIdToDelete !== null) {
      this.typeService
        .deleteType(this.typeIdToDelete.toString())
        .subscribe(() => {
          this.loadTypes();
          this.showConfirm = false;
          this.typeIdToDelete = null;
        });
    }
  }

  onCancel() {
    this.showConfirm = false;
    this.typeIdToDelete = null;
  }

  onAddType() {
    this.router.navigate(['admin/types/create']);
  }

  onEditType(entity: AdminEntity) {
    this.router.navigate(['admin/types/edit', entity.id]);
  }
}
