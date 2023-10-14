import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  QueryClientService,
  UsePersistedQuery,
  UseQuery,
  queryOptions,
} from '@ngneat/query';
import { environment } from 'src/environments/environment';
import {
  CreateProductDto,
  FetchProductsResult,
  FilterProducts,
  PriceChangeHistory,
  Product,
  StockChangeHistory,
  UpdateProductDto,
} from '../interfaces/products';
import { delay, firstValueFrom, map, of, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private queryClient = inject(QueryClientService);
  private http = inject(HttpClient);
  private useQuery = inject(UseQuery);
  private usePersistedQuery = inject(UsePersistedQuery);

  apiUrl = environment.apiUrl + '/products';

  getProducts = this.usePersistedQuery(
    (queryKey: ['products', number], params) => {
      return queryOptions({
        queryKey,
        queryFn: ({ queryKey }) => {
          const filters: FilterProducts = {
            limit: params!['limit'] as number,
            page: params!['page'] as number,
            maxPrice: params!['maxPrice'] as number,
            minPrice: params!['minPrice'] as number,
            search: params!['search'] as string,
          };
          return this.fetchProducts(filters);
        },
      });
    }
  );

  getProduct(id: string) {
    return this.useQuery(['products', id], () => {
      return this.http.get<Product>(`${this.apiUrl}/${id}`);
    });
  }

  getProductHistoryPrices(id: string) {
    return this.useQuery(['price-history', id], () => {
      return this.http.get<PriceChangeHistory[]>(
        `${this.apiUrl}/price-history/${id}`
      );
    });
  }

  getProductHistoryStock(id: string) {
    return this.useQuery(['stock-history', id], () => {
      return this.http.get<StockChangeHistory[]>(
        `${this.apiUrl}/stock-history/${id}`
      );
    });
  }

  fetchProducts({ limit, page, maxPrice, minPrice, search }: FilterProducts) {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());

    if (maxPrice) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (minPrice) {
      params = params.set('minPrice', minPrice.toString());
    }

    if (search) {
      params = params.set('search', search.toString());
    }

    return this.http.get<FetchProductsResult>(this.apiUrl, { params });
  }

  prefetch(params: FilterProducts) {
    return this.queryClient.prefetchQuery(['products', params.page], () =>
      firstValueFrom(this.fetchProducts(params))
    );
  }

  createProduct(payload: CreateProductDto) {
    return this.http.post(this.apiUrl, { ...payload }).pipe(
      tap((response) => {
        this.queryClient.invalidateQueries(['products']);
        return response;
      })
    );
  }

  updateProduct(id: string, payload: UpdateProductDto) {
    return this.http.put(`${this.apiUrl}/${id}`, { ...payload }).pipe(
      tap((response) => {
        this.queryClient.invalidateQueries(['products', id]);
        return response;
      })
    );
  }

  changePrice(id: string, newPrice: number) {
    return this.http
      .post(`${this.apiUrl}/change-price/${id}`, { newPrice })
      .pipe(
        tap((response) => {
          this.queryClient.invalidateQueries(['products', id]);
          return response;
        })
      );
  }

  changeStock(id: string, newStock: number) {
    return this.http
      .post(`${this.apiUrl}/change-stock/${id}`, { newStock })
      .pipe(
        tap((response) => {
          this.queryClient.invalidateQueries(['products', id]);
          return response;
        })
      );
  }
}
