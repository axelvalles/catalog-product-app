import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-product-history-page',
  templateUrl: './product-history-page.component.html',
  styleUrls: ['./product-history-page.component.css'],
})
export class ProductHistoryPageComponent {
  private subs = new SubSink();
  productId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter(Boolean)
  );
  product$ = this.productId$.pipe(
    switchMap((id) => this.productSvc.getProduct(id).result$)
  );
  productPriceHistory$ = this.productId$.pipe(
    switchMap((id) => this.productSvc.getProductHistoryPrices(id).result$)
  );
  productStockHistory$ = this.productId$.pipe(
    switchMap((id) => this.productSvc.getProductHistoryStock(id).result$)
  );

  constructor(
    private productSvc: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subs.sink = this.product$.subscribe((res) => {
      if (res.failureCount === 3) {
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
