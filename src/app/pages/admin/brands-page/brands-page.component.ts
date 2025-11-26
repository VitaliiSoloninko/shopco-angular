import { Component, inject, OnInit } from '@angular/core';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { Brand } from '../../../entities/brand/model/brand';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-brands-page',
  imports: [GrayLineComponent, AdminEntityListComponent],
  templateUrl: './brands-page.component.html',
  styleUrl: './brands-page.component.scss',
})
export class BrandsPageComponent implements OnInit {
  brands: Brand[] = [];
  adminEntities: AdminEntity[] = [];
  brandService = inject(BrandService);
  loading = false;

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
    if (confirm('Delete this brand?')) {
      this.brandService.deleteBrand(brandId.toString()).subscribe(() => {
        this.loadBrands();
      });
    }
  }
}
