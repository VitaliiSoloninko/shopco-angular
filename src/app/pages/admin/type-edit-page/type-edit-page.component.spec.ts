import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEditPageComponent } from './type-edit-page.component';

describe('TypeEditPageComponent', () => {
  let component: TypeEditPageComponent;
  let fixture: ComponentFixture<TypeEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
