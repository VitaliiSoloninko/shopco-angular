export interface Type {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypeCreateDto {
  name: string;
}

export interface TypeUpdateDto {
  name?: string;
}
