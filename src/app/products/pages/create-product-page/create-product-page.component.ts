import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MyValidators } from 'src/app/core/utils/validators';
import { ProductsService } from '../../services/products.service';
import { useMutationResult } from '@ngneat/query';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.css'],
})
export class CreateProductPageComponent implements OnDestroy {
  // states
  private subs = new SubSink();
  productForm!: FormGroup;
  addProductMutation = useMutationResult();

  // lifecycle
  constructor(private fb: FormBuilder, private productSvc: ProductsService) {
    this.initForm();

    this.subs.sink = this.addProductMutation.result$.subscribe((response) => {
      if (response.isLoading) {
        this.productForm.disable();
      } else {
        this.productForm.enable();
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
      .createProduct({
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        sku: this.productForm.getRawValue().sku,
        price: this.productForm.getRawValue().price,
        stock: this.productForm.getRawValue().stock,
        image: this.productForm.getRawValue().image,
        tags: this.productForm.getRawValue().tags,
      })
      .pipe(this.addProductMutation.track())
      .subscribe((response) => {
        console.log(response);
        this.productForm.setValue({
          name: '',
          description: '',
          sku: '',
          price: null,
          stock: null,
          image: '',
          tags: [],
        });
        this.productForm.reset();
      });
  }

  // form controls
  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
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

  get inputSkuError(): boolean {
    return Boolean(
      this.productForm.get('sku')?.touched &&
        this.productForm.get('sku')?.invalid
    );
  }

  get inputPriceError(): boolean {
    return Boolean(
      this.productForm.get('price')?.touched &&
        this.productForm.get('price')?.invalid
    );
  }

  get inputStockError(): boolean {
    return Boolean(
      this.productForm.get('stock')?.touched &&
        this.productForm.get('stock')?.invalid
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
