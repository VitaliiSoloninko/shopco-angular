export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandCreateDto {
  name: string;
}

export interface BrandUpdateDto {
  name?: string;
}
