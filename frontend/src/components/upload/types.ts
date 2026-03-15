export interface UploadedImage {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export interface PreviewFile extends File {
  id: string;
  preview: string;
  filters?: ImageFilters;
  altText?: string;
  retryCount?: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
}

export interface FileWithError extends File {
  id: string;
  errors: { code: string; message: string }[];
  preview?: string;
  retryCount?: number;
}

export type LayoutMode = "grid" | "list";

export interface ImageUploadProps {
  onUploadComplete?: (results: UploadedImage[]) => void;
  onOrderChange?: (images: UploadedImage[]) => void;
  maxFiles?: number;
  uploadType?: "wedding" | "gallery" | "thumbnail" | "rsvp" | "general";
  className?: string;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  compressionOptions?: {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    quality?: number;
  };
  enableImageCropping?: boolean;
  enableImageFilters?: boolean;
  enableMetadataEditing?: boolean;
  enableBulkActions?: boolean;
  initialLayoutMode?: LayoutMode;
}
