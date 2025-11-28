import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BRANDS_URL } from '../../../urls';
import { Brand, BrandCreateDto, BrandUpdateDto } from '../model/brand';

@Injectable({ providedIn: 'root' })
export class BrandService {
  constructor(private http: HttpClient) {}

  createBrand(brand: BrandCreateDto): Observable<Brand> {
    return this.http.post<Brand>(BRANDS_URL, brand);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(BRANDS_URL);
  }

  getBrand(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${BRANDS_URL}/${id}`);
  }

  updateBrand(id: string, brand: BrandUpdateDto): Observable<Brand> {
    return this.http.patch<Brand>(`${BRANDS_URL}/${id}`, brand);
  }

  deleteBrand(id: string): Observable<void> {
    return this.http.delete<void>(`${BRANDS_URL}/${id}`);
  }

  getBrandsCount(): Observable<number> {
    return this.getBrands().pipe(map((brands: Brand[]) => brands.length));
  }
}
