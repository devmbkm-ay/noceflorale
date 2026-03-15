import { toast } from "sonner";

export interface CompressionOptions {
  maxSizeMB: number; // maximum size in MB
  maxWidthOrHeight: number; // maximum width or height in pixels
  useWebWorker?: boolean; // use Web Worker for compression (default: true)
  preserveExif?: boolean; // preserve Exif data (default: true)
  quality?: number; // compression quality (0 to 1)
}

/**
 * Compresses an image file using browser-based techniques
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    preserveExif: true,
    quality: 0.8,
  }
): Promise<File> => {
  // Simple compression for small images - skip compression
  if (file.size < options.maxSizeMB * 1024 * 1024) {
    return file;
  }

  try {
    return await compressImageWithCanvas(file, options);
  } catch (error) {
    console.error("Image compression failed:", error);
    toast.error("Image compression failed, using original file");
    return file;
  }
};

/**
 * Compresses an image using HTML Canvas
 */
const compressImageWithCanvas = async (
  file: File,
  options: CompressionOptions
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      // Release object URL
      URL.revokeObjectURL(img.src);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const maxSize = options.maxWidthOrHeight;
      
      if (width > height) {
        if (width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"));
            return;
          }
          
          // Create new file from blob
          const compressedFile = new File(
            [blob],
            file.name,
            {
              type: file.type,
              lastModified: file.lastModified,
            }
          );
          
          resolve(compressedFile);
        },
        file.type,
        options.quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
  });
};

/**
 * Compresses multiple images in parallel
 */
export const compressImages = async (
  files: File[],
  options?: CompressionOptions
): Promise<File[]> => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

/**
 * Generates a low-quality preview of an image
 */
export const generateImagePreview = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      // Release object URL
      URL.revokeObjectURL(img.src);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Create a small preview (thumbnail size)
      const maxPreviewSize = 100;
      let { width, height } = img;
      
      if (width > height) {
        height = Math.round(height * maxPreviewSize / width);
        width = maxPreviewSize;
      } else {
        width = Math.round(width * maxPreviewSize / height);
        height = maxPreviewSize;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get data URL (low quality JPEG)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image for preview"));
    };
  });
};

