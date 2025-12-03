import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageUploadComponent } from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate file size', () => {
    const file = new File([''], 'test.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    // Mock file size (6MB - exceeds 5MB limit)
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

    const result = (component as any).validateFile(file);
    expect(result).toBeFalsy();
    expect(component.errors.length).toBeGreaterThan(0);
    expect(component.errors[0].type).toBe('size');
  });

  it('should validate file format', () => {
    const file = new File([''], 'test.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    const result = (component as any).validateFile(file);
    expect(result).toBeFalsy();
    expect(component.errors.length).toBeGreaterThan(0);
    expect(component.errors[0].type).toBe('format');
  });

  it('should accept valid image file', () => {
    const file = new File([''], 'test.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    const result = (component as any).validateFile(file);
    expect(result).toBeTruthy();
    expect(component.errors.length).toBe(0);
  });

  it('should generate correct accept attribute', () => {
    // Создаем новый компонент с нужными параметрами
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
    });

    const newFixture = TestBed.createComponent(ImageUploadComponent);
    const newComponent = newFixture.componentInstance;

    // Устанавливаем input через fixture
    newFixture.componentRef.setInput('acceptedFormats', ['jpg', 'png']);
    newFixture.detectChanges();

    expect(newComponent.acceptAttribute).toBe('.jpg,.png');
  });
});
