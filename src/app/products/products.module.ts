import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsLayoutComponent } from './components/products-layout/products-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { SubscribeDirective } from '@ngneat/subscribe';
import { CreateProductPageComponent } from './pages/create-product-page/create-product-page.component';
import { UpdateProductPageComponent } from './pages/update-product-page/update-product-page.component';
import { ChangePriceProductPageComponent } from './pages/change-price-product-page/change-price-product-page.component';
import { ChangeStockProductPageComponent } from './pages/change-stock-product-page/change-stock-product-page.component';
import { ProductHistoryPageComponent } from './pages/product-history-page/product-history-page.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

@NgModule({
  declarations: [
    ProductsPageComponent,
    ProductsLayoutComponent,
    NavbarComponent,
    CreateProductPageComponent,
    UpdateProductPageComponent,
    ChangePriceProductPageComponent,
    ChangeStockProductPageComponent,
    ProductHistoryPageComponent,
    ProductDetailComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SubscribeDirective,
  ],
})
export class ProductsModule {}
