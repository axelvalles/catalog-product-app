import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { useMutationResult } from '@ngneat/query';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-change-price-product-page',
  templateUrl: './change-price-product-page.component.html',
  styleUrls: ['./change-price-product-page.component.css'],
})
export class ChangePriceProductPageComponent implements OnDestroy {
  // states
  private subs = new SubSink();
  productForm!: FormGroup;
  updateProductMutation = useMutationResult();
  productId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter(Boolean)
  );
  productId = '';
  product$ = this.productId$.pipe(
    switchMap((id) => this.productSvc.getProduct(id).result$)
  );
  isLoading$ = combineLatest([
    this.product$,
    this.updateProductMutation.result$,
  ]).pipe(
    map((array) => {
      console.log(array);

      return array.some((observer) => observer.isLoading);
    })
  );

  // lifecycle
  constructor(
    private fb: FormBuilder,
    private productSvc: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();

    this.subs.sink = this.isLoading$.subscribe((value) => {
      if (value) {
        this.productForm.disable();
      } else {
        this.productForm.enable();
      }
    });

    this.subs.sink = this.product$.subscribe((res) => {
      if (res.data) {
        this.productId = res.data._id;
        this.productForm.setValue({
          price: res.data.price,
        });
      }

      if (res.failureCount === 3) {
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // methods
  onSubmit() {
    this.productForm.markAllAsTouched();

    if (!this.productForm.valid) return;

    this.productSvc
      .changePrice(this.productId, this.productForm.getRawValue().price)
      .pipe(this.updateProductMutation.track())
      .subscribe((response) => {
        console.log(response);
        this.productForm.setValue({
          price: null,
        });
        this.productForm.reset();
        this.router.navigate(['/products']);
      });
  }

  // form controls
  initForm() {
    this.productForm = this.fb.group({
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  get inputPriceError(): boolean {
    return Boolean(
      this.productForm.get('price')?.touched &&
        this.productForm.get('price')?.invalid
    );
  }
}
