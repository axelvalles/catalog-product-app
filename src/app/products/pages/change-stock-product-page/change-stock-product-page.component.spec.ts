import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStockProductPageComponent } from './change-stock-product-page.component';

describe('ChangeStockProductPageComponent', () => {
  let component: ChangeStockProductPageComponent;
  let fixture: ComponentFixture<ChangeStockProductPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeStockProductPageComponent]
    });
    fixture = TestBed.createComponent(ChangeStockProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
