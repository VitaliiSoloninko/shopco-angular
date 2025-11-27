import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandEditPageComponent } from './brand-edit-page.component';

describe('BrandEditPageComponent', () => {
  let component: BrandEditPageComponent;
  let fixture: ComponentFixture<BrandEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
