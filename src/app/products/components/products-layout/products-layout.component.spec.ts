import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsLayoutComponent } from './products-layout.component';

describe('ProductsLayoutComponent', () => {
  let component: ProductsLayoutComponent;
  let fixture: ComponentFixture<ProductsLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsLayoutComponent]
    });
    fixture = TestBed.createComponent(ProductsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
