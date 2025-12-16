import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { FILTER_GROUPS } from '../../../data/filter-groups.data';
import { ProductService } from '../../../entities/product/api/product.service';
import { Product } from '../../../entities/product/model/product';
import { ProductListComponent } from '../../../entities/product/ui/product-list/product-list.component';
import { ProductFiltersComponent } from '../../../features/product/product-filters/product-filters.component';
import { ProductPaginationComponent } from '../../../features/product/product-pagination/product-pagination.component';
import { ProductSearchComponent } from '../../../features/product/product-search/product-search.component';
import { ProductSortComponent } from '../../../features/product/product-sort/product-sort.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-products-catalog',
  imports: [
    ProductFiltersComponent,
    ProductListComponent,
    ProductPaginationComponent,
    ProductSortComponent,
    ProductSearchComponent,
    ModalComponent,
    EmptyStateComponent,
  ],
  templateUrl: './products-catalog.component.html',
  styleUrl: './products-catalog.component.scss',
})
export class ProductsCatalogComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  allProducts: Product[] = [];

  // --- SEARCH ---
  searchValue = '';
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit() {
    // Load products from backend
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });

    // Initial sort and filters from query params
    this.route.queryParams.subscribe((params) => {
      if (params['sort']) {
        this.sortBy = params['sort'];
      }

      // Apply filters from query params
      this.selectedFilters = {};
      Object.keys(params).forEach((key) => {
        if (key !== 'sort' && params[key]) {
          this.selectedFilters[key] = params[key];
        }
      });

      this.applyFilters();
    });

    // Debounced search subscription
    this.searchSub = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.searchValue = value;
        this.applyFilters();
      });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  // --- FILTERS ---
  filterGroups = FILTER_GROUPS;
  selectedFilters: { [key: string]: string } = {};

  onFilterSelected(event: { group: string; value: string }) {
    this.selectedFilters[event.group] = event.value;
    this.updateQueryParams();
    this.applyFilters();
  }

  resetFilters() {
    this.selectedFilters = {};
    this.updateQueryParams();
    this.applyFilters();
    this.currentPage = 1;
  }

  private updateQueryParams() {
    const queryParams: any = { ...this.selectedFilters };
    if (this.sortBy && this.sortBy !== 'price-asc') {
      queryParams['sort'] = this.sortBy;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  // --- FILTERS MODAL ----
  showFiltersModal = false;

  openFiltersModal() {
    this.showFiltersModal = true;
  }

  closeFiltersModal() {
    this.showFiltersModal = false;
  }

  applyFiltersFromModal() {
    this.showFiltersModal = false;
  }

  // --- FILTERING & SEARCHING ---
  filteredProducts = this.allProducts;

  applyFilters() {
    this.filteredProducts = this.productService.filterProducts(
      this.allProducts,
      this.selectedFilters,
      this.searchValue
    );
    this.filteredProducts = this.productService.sortProducts(
      this.filteredProducts,
      this.sortBy
    );
    this.currentPage = 1;
  }

  // --- PAGINATION ---
  pageSize = 12;
  currentPage = 1;

  get pagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // --- SORTING ---
  sortBy: string = 'price-asc';

  sortProducts(sortType: string) {
    this.sortBy = sortType;
    this.updateQueryParams();
    this.filteredProducts = this.productService.sortProducts(
      this.filteredProducts,
      sortType
    );
    this.goToPage(1);
  }
}
