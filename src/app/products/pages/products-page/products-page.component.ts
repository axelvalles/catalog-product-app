import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { FilterProducts, Product } from '../../interfaces/products';
import { Pagination, paginateArray } from 'src/app/core/utils/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  // states
  private filter = new BehaviorSubject<FilterProducts>({
    page: 1,
    limit: 10,
  });
  itemsPerPage = 10;
  filter$ = this.filter.asObservable();
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 0,
    pages: [],
    hasPrevPage: false,
    hasNextPage: false,
  };
  form!: FormGroup;
  // querys
  products$ = this.filter$.pipe(
    switchMap((filter) => {
      return this.productsSvc
        .getProducts(['products', filter.page], { ...filter })
        .result$.pipe(
          tap((result) => {
            this.pagination = paginateArray(
              filter.page,
              result.data?.total || 0,
              filter.limit
            );

            result.data?.hasNextPage &&
              this.productsSvc.prefetch({ ...filter, page: filter.page + 1 });
          })
        );
    })
  );

  constructor(private fb: FormBuilder, private productsSvc: ProductsService) {
    this.initForm();
  }

  // methods
  changePage(page: number) {
    if (page === this.filter.value.page) {
      return;
    }

    this.filter.next({
      ...this.filter.value,
      page,
    });
  }

  changeLimit(e: Event) {
    const element = e.target as HTMLSelectElement;

    this.filter.next({
      ...this.filter.value,
      page: 1,
      limit: Number(element.value),
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    const result = this.priceRangeValidator();

    this.form.setErrors(result);

    if (!this.form.valid) return;

    const values = this.form.getRawValue();

    this.filter.next({
      ...this.filter.value,
      search: values.search,
      page: 1,
      maxPrice: values.maxPrice,
      minPrice: values.minPrice,
    });
  }

  resetFilters() {
    this.form.reset();
    this.form.setValue({
      maxPrice: null,
      minPrice: null,
      search: '',
    });
    this.filter.next({
      ...this.filter.value,
      page: 1,
      maxPrice: undefined,
      minPrice: undefined,
      search: '',
    });
  }

  // form controls

  initForm() {
    this.form = this.fb.group({
      minPrice: [null, [Validators.min(0)]],
      maxPrice: [null, [Validators.min(0)]],
      search: ['', [Validators.required]],
    });
  }

  priceRangeValidator() {
    const minPrice = this.form.get('minPrice')?.value;
    const maxPrice = this.form.get('maxPrice')?.value;

    if (minPrice !== null && maxPrice !== null) {
      if (Number(minPrice) > Number(maxPrice)) {
        return { priceRangeInvalid: true };
      }
    }

    return null;
  }

  get inputSearchError(): boolean {
    return Boolean(
      this.form.get('search')?.touched && this.form.get('search')?.invalid
    );
  }

  get inputSearchErrorMessage() {
    const input = this.form.get('search');

    if (!input || !input?.errors) {
      return '';
    }

    if (input.hasError('required')) {
      return 'this field is required';
    }

    return '';
  }

  get inputMinPriceError(): boolean {
    if (this.form.hasError('priceRangeInvalid')) {
      return true;
    }

    return Boolean(
      this.form.get('minPrice')?.touched && this.form.get('minPrice')?.invalid
    );
  }

  get inputMaxPriceError(): boolean {
    if (this.form.hasError('priceRangeInvalid')) {
      return true;
    }

    return Boolean(
      this.form.get('maxPrice')?.touched && this.form.get('maxPrice')?.invalid
    );
  }

  get inputMinPriceErrorMessage() {
    if (this.form.hasError('priceRangeInvalid')) {
      return 'min price cannot be greater than max price';
    }

    const input = this.form.get('minPrice');

    if (!input || !input?.errors) {
      return '';
    }

    if (input.hasError('min')) {
      return 'min value 0';
    }

    return '';
  }

  get inputMaxPriceErrorMessage() {
    if (this.form.hasError('priceRangeInvalid')) {
      return 'max price cannot be less than min price';
    }

    const input = this.form.get('maxPrice');

    if (!input || !input?.errors) {
      return '';
    }

    if (input.hasError('min')) {
      return 'min value 1000';
    }

    return '';
  }
}
