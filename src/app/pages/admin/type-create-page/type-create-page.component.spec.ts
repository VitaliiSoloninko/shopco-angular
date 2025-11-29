import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCreatePageComponent } from './type-create-page.component';

describe('TypeCreatePageComponent', () => {
  let component: TypeCreatePageComponent;
  let fixture: ComponentFixture<TypeCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
