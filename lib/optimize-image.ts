/**
 * Client-side image optimization utility.
 * Resizes large photos taken with mobile phone cameras or high-res images
 * down to a web-optimized resolution (default max 1200px) and compresses to WebP/JPEG.
 * This prevents hitting Vercel's 4.5MB serverless payload limit and speeds up uploads over mobile data.
 */
export async function optimizeImageForUpload(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.85
): Promise<File> {
  // If not in a browser environment or not an image file, return the original file
  if (typeof window === 'undefined' || !file || !file.type.startsWith('image/')) {
    return file;
  }

  // If the file is already small (under 400KB), return as is unless it's an unusually large canvas
  if (file.size < 400 * 1024 && file.type === 'image/webp') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return resolve(file);
      }

      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format - try WebP first, fallback to JPEG
      const outputType = 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          // Generate a clean filename with webp extension
          const originalName = file.name || 'perfume_photo';
          const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const optimizedFile = new File([blob], `${baseName}.webp`, {
            type: outputType,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
