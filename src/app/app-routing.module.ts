import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './products/pages/products-page/products-page.component';
import { ProductsLayoutComponent } from './products/components/products-layout/products-layout.component';
import { CreateProductPageComponent } from './products/pages/create-product-page/create-product-page.component';
import { UpdateProductPageComponent } from './products/pages/update-product-page/update-product-page.component';
import { ChangePriceProductPageComponent } from './products/pages/change-price-product-page/change-price-product-page.component';
import { ChangeStockProductPageComponent } from './products/pages/change-stock-product-page/change-stock-product-page.component';
import { ProductHistoryPageComponent } from './products/pages/product-history-page/product-history-page.component';
import { ProductDetailComponent } from './products/pages/product-detail/product-detail.component';

const routes: Routes = [
  {
    component: ProductsLayoutComponent,
    path: 'products',
    children: [
      {
        component: ProductsPageComponent,
        path: '',
      },
      {
        component: CreateProductPageComponent,
        path: 'create',
      },
      {
        component: ProductDetailComponent,
        path: ':id',
      },
      {
        component: UpdateProductPageComponent,
        path: 'update/:id',
      },
      {
        component: ChangePriceProductPageComponent,
        path: 'change-price/:id',
      },
      {
        component: ChangeStockProductPageComponent,
        path: 'change-stock/:id',
      },
      {
        component: ProductHistoryPageComponent,
        path: 'history/:id',
      },
    ],
  },
  { path: '**', redirectTo: 'products' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
