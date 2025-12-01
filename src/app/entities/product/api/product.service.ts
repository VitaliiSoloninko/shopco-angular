import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BRANDS } from '../../../data/brands.data';
import { PRODUCTS_DATA } from '../../../data/products.data';
import { TYPES } from '../../../data/types.data';
import { PRODUCTS_URL } from '../../../urls';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductsResponse,
} from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // API methods for CRUD operations
  createProduct(product: ProductCreateDto): Observable<Product> {
    return this.http.post<Product>(PRODUCTS_URL, product);
  }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(PRODUCTS_URL);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCTS_URL}/${id}`);
  }

  updateProduct(id: string, product: ProductUpdateDto): Observable<Product> {
    return this.http.patch<Product>(`${PRODUCTS_URL}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${PRODUCTS_URL}/${id}`);
  }

  getProductsCount(): Observable<number> {
    return this.getProducts().pipe(map((response) => response.total));
  }
  getAllProducts(): Product[] {
    return PRODUCTS_DATA.rows;
  }

  filterProducts(
    products: Product[],
    selectedFilters: { [key: string]: string },
    searchValue: string
  ): Product[] {
    return products.filter((product) => {
      // Filter by type
      if (selectedFilters['type']) {
        const type = TYPES.find((t) => t.name === selectedFilters['type']);
        if (!type || product.typeId !== type.id) return false;
      }
      // Filter by brand
      if (selectedFilters['brand']) {
        const brand = BRANDS.find((b) => b.name === selectedFilters['brand']);
        if (!brand || product.brandId !== brand.id) return false;
      }
      // Filter by search
      if (
        searchValue &&
        !product.name.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }

  sortProducts(products: Product[], sortType: string): Product[] {
    switch (sortType) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-desc':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return products;
    }
  }

  getNewestProducts(count: number = 4): Product[] {
    return [...PRODUCTS_DATA.rows]
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, count);
  }

  getTopRatedProducts(count: number = 4): Product[] {
    return [...PRODUCTS_DATA.rows]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count);
  }
}
