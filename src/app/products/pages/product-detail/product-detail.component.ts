import { Component, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, switchMap, throwError } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnDestroy {
  private subs = new SubSink();
  productId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter(Boolean)
  );
  product$ = this.productId$.pipe(
    switchMap((id) => this.productSvc.getProduct(id).result$)
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
