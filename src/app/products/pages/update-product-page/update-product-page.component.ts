import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MyValidators } from 'src/app/core/utils/validators';
import { ProductsService } from '../../services/products.service';
import { useMutationResult } from '@ngneat/query';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-update-product-page',
  templateUrl: './update-product-page.component.html',
  styleUrls: ['./update-product-page.component.css'],
})
export class UpdateProductPageComponent implements OnDestroy {
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
          name: res.data.name,
          description: res.data.description,
          image: res.data.image,
          tags: res.data.tags,
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
      .updateProduct(this.productId, {
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        image: this.productForm.getRawValue().image,
        tags: this.productForm.getRawValue().tags,
      })
      .pipe(this.updateProductMutation.track())
      .subscribe((response) => {
        console.log(response);
        this.productForm.setValue({
          name: '',
          description: '',
          image: '',
          tags: [],
        });
        this.productForm.reset();
        this.router.navigate(['/products']);
      });
  }

  // form controls
  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required, MyValidators.isValidUrl]],
      tags: [[]],
    });
  }

  get inputNameError(): boolean {
    return Boolean(
      this.productForm.get('name')?.touched &&
        this.productForm.get('name')?.invalid
    );
  }

  get inputDescriptionError(): boolean {
    return Boolean(
      this.productForm.get('description')?.touched &&
        this.productForm.get('description')?.invalid
    );
  }

  get inputImageError(): boolean {
    return Boolean(
      this.productForm.get('image')?.touched &&
        this.productForm.get('image')?.invalid
    );
  }

  get inputImageErrorMessage() {
    const input = this.productForm.get('image');

    if (!input || !input?.errors) {
      return '';
    }

    if (input.errors['required']) {
      return 'This field is required';
    }

    if (input.errors['invalidUrl']) {
      return 'Invalid url';
    }

    return '';
  }

  get inputTagsError(): boolean {
    return Boolean(
      this.productForm.get('tags')?.touched &&
        this.productForm.get('tags')?.invalid
    );
  }
}
