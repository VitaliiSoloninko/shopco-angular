import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadTestComponent } from './image-upload-test.component';

describe('ImageUploadTestComponent', () => {
  let component: ImageUploadTestComponent;
  let fixture: ComponentFixture<ImageUploadTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageUploadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
