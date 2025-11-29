import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TYPES_URL } from '../../../urls';
import { Type, TypeCreateDto, TypeUpdateDto } from '../model/type';

@Injectable({ providedIn: 'root' })
export class TypeService {
  constructor(private http: HttpClient) {}

  createType(type: TypeCreateDto): Observable<Type> {
    return this.http.post<Type>(TYPES_URL, type);
  }

  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(TYPES_URL);
  }

  getType(id: string): Observable<Type> {
    return this.http.get<Type>(`${TYPES_URL}/${id}`);
  }

  updateType(id: string, type: TypeUpdateDto): Observable<Type> {
    return this.http.patch<Type>(`${TYPES_URL}/${id}`, type);
  }

  deleteType(id: string): Observable<void> {
    return this.http.delete<void>(`${TYPES_URL}/${id}`);
  }

  getTypesCount(): Observable<number> {
    return this.getTypes().pipe(map((types: Type[]) => types.length));
  }
}
