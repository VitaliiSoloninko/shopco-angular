export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  img: string;
  oldPrice?: number | null;
  discount?: number | null;
  typeId: number;
  brandId: number;
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: number;
    name: string;
  };
  type?: {
    id: number;
    name: string;
  };
}

export interface ProductCreateDto {
  name: string;
  price: number;
  rating: number;
  img?: string;
  oldPrice?: number;
  discount?: number;
  typeId: number;
  brandId: number;
}

export interface ProductUpdateDto {
  name?: string;
  price?: number;
  rating?: number;
  img?: string;
  oldPrice?: number;
  discount?: number;
  typeId?: number;
  brandId?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
