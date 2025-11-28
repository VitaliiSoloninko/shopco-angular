import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { Brand } from '../../../entities/brand/model/brand';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { AddButtonComponent } from '../../../shared/ui/add-button/add-button.component';

@Component({
  selector: 'app-brands-page',
  imports: [
    CommonModule,
    GrayLineComponent,
    AdminEntityListComponent,
    ModalComponent,
    LoaderComponent,
    AddButtonComponent,
  ],
  templateUrl: './brands-page.component.html',
  styleUrl: './brands-page.component.scss',
})
export class BrandsPageComponent implements OnInit {
  brands: Brand[] = [];
  adminEntities: AdminEntity[] = [];
  brandService = inject(BrandService);
  router = inject(Router);
  loading = false;
  showConfirm = false;
  brandIdToDelete: number | null = null;

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.adminEntities = brands.map((b) => ({ id: b.id!, name: b.name }));
      },
      error: () => {},
      complete: () => {
        this.loading = false;
      },
    });
  }

  onDeleteBrand(brandId: number) {
    this.brandIdToDelete = brandId;
    this.showConfirm = true;
  }

  onConfirm() {
    if (this.brandIdToDelete !== null) {
      this.brandService
        .deleteBrand(this.brandIdToDelete.toString())
        .subscribe(() => {
          this.loadBrands();
          this.showConfirm = false;
          this.brandIdToDelete = null;
        });
    }
  }

  onCancel() {
    this.showConfirm = false;
    this.brandIdToDelete = null;
  }

  onAddBrand() {
    this.router.navigate(['admin/brands/create']);
  }

  onEditBrand(entity: AdminEntity) {
    this.router.navigate(['admin/brands/edit', entity.id]);
  }
}
