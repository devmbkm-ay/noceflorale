import imageCompression from "browser-image-compression";
import { toast } from "@/utils/safeToast";
import { ImageFilters } from "./types";

// Generate image preview URL
export const generateImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Compress image with options
export const compressImage = async (
  file: File,
  options: {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    quality?: number;
  }
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: true,
      ...(options.quality && { initialQuality: options.quality }),
    });

    // Preserve original filename
    const newFile = new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });

    return newFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    toast.error(`Failed to compress ${file.name}`);
    return file; // Return original file on error
  }
};

// Validate file type and size
export const validateFile = (
  file: File,
  accept: Record<string, string[]>,
  maxSize: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check file type
  const acceptedTypes = Object.values(accept).flat();
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidType = acceptedTypes.includes(fileExtension) || 
                     Object.keys(accept).some(mimeType => file.type.match(mimeType));

  if (!isValidType) {
    errors.push(`File type not supported. Accepted: ${acceptedTypes.join(", ")}`);
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Convert file to blob for cropping
export const fileToBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(new Blob([reader.result], { type: file.type }));
      } else {
        reject(new Error("Failed to convert file to blob"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

// Apply filters to image data URL
export const applyFiltersToImage = (
  imageUrl: string,
  filters: ImageFilters
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filters
      ctx.filter = [
        `brightness(${filters.brightness}%)`,
        `contrast(${filters.contrast}%)`,
        `saturate(${filters.saturation}%)`,
        `blur(${filters.blur}px)`,
        `grayscale(${filters.grayscale}%)`,
        `sepia(${filters.sepia}%)`,
        `hue-rotate(${filters.hueRotate}deg)`,
      ].join(" ");

      ctx.drawImage(img, 0, 0);
      
      try {
        const filteredDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        resolve(filteredDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
};

// Generate unique file ID
export const generateFileId = (file: File): string => {
  return `${Date.now()}-${file.name}-${file.size}`;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Create default image filters
export const createDefaultFilters = (): ImageFilters => ({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
});

// Reset filters to default
export const resetFilters = (): ImageFilters => createDefaultFilters();

// Batch process files with progress callback
export const batchProcessFiles = async <T>(
  files: File[],
  processor: (file: File, index: number) => Promise<T>,
  onProgress?: (progress: number) => void
): Promise<T[]> => {
  const results: T[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const result = await processor(files[i], i);
    results.push(result);
    
    if (onProgress) {
      onProgress(((i + 1) / total) * 100);
    }
  }

  return results;
};
