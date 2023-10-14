export interface CreateProductDto {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  tags: string[];
}

export interface UpdateProductDto {
  name: string;
  description: string;
  image: string;
  tags: string[];
}

export interface FilterProducts {
  limit: number;
  page: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FetchProductsResult {
  data: Product[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
}

export interface PriceChangeHistory {
  _id: string;
  product: string;
  newPrice: number;
  oldPrice: number;
  date: Date;
  __v: number;
}

export interface StockChangeHistory {
  _id: string;
  product: string;
  newStock: number;
  oldStock: number;
  date: Date;
  __v: number;
}
