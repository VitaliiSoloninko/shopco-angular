import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNotesFormComponent } from './order-notes-form.component';

describe('OrderNotesFormComponent', () => {
  let component: OrderNotesFormComponent;
  let fixture: ComponentFixture<OrderNotesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderNotesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderNotesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
