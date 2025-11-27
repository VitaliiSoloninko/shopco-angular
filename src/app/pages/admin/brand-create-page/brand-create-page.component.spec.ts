import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandCreatePageComponent } from './brand-create-page.component';

describe('BrandCreatePageComponent', () => {
  let component: BrandCreatePageComponent;
  let fixture: ComponentFixture<BrandCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
