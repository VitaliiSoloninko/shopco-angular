import { IMAGES_BASE_URL } from '../../urls';

/**
 * Converts a relative image path to an absolute URL
 * @param imagePath - The image path (relative or absolute)
 * @returns The full image URL
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGES_BASE_URL + imagePath;
}
