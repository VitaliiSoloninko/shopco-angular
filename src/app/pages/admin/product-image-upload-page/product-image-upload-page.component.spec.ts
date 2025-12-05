import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageUploadPageComponent } from './product-image-upload-page.component';

describe('ProductImageUploadPageComponent', () => {
  let component: ProductImageUploadPageComponent;
  let fixture: ComponentFixture<ProductImageUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageUploadPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImageUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
