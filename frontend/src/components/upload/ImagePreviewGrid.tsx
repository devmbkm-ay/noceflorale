import React from "react";
import { motion, Reorder } from "framer-motion";
import { CheckCircle, Loader2, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { PreviewFile, UploadedImage, LayoutMode } from "./types";

interface ImagePreviewGridProps {
  previewFiles: PreviewFile[];
  uploadedImages: UploadedImage[];
  selectedImages: string[];
  layoutMode: LayoutMode;
  uploading: boolean;
  fileProgresses: { id: string; filename: string; progress: number; status: string }[];
  onPreviewFilesReorder: (files: PreviewFile[]) => void;
  onUploadedImagesReorder: (images: UploadedImage[]) => void;
  onSelectImage: (id: string) => void;
  onEditFile: (file: PreviewFile) => void;
  onEditImage: (image: UploadedImage) => void;
  onRemoveFile: (id: string) => void;
  onDeleteImage: (publicId: string) => void;
  onRetryUpload: (file: PreviewFile) => void;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  previewFiles,
  uploadedImages,
  selectedImages,
  layoutMode,
  uploading,
  fileProgresses,
  onPreviewFilesReorder,
  onUploadedImagesReorder,
  onSelectImage,
  onEditFile,
  onEditImage,
  onRemoveFile,
  onDeleteImage,
  onRetryUpload,
}) => {
  const gridClassName = layoutMode === "grid" 
    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
    : "space-y-2";

  const renderPreviewFile = (file: PreviewFile) => {
    const progressItem = fileProgresses.find(p => p.filename === file.name);
    const progress = progressItem ? progressItem.progress : 0;
    const isUploading = uploading && progress > 0 && progress < 100;

    return (
      <motion.div
        key={file.id}
        layout
        className={`
          relative group border rounded-lg overflow-hidden
          ${layoutMode === "list" ? "flex items-center p-2 space-x-4" : "aspect-square"}
        `}
      >
        <div className={layoutMode === "list" ? "w-16 h-16 flex-shrink-0" : "relative w-full h-full"}>
          <Image
            src={file.preview}
            alt={file.altText || file.name}
            fill
            className="object-cover"
            style={{
              filter: file.filters ? createFilterString(file.filters) : undefined,
            }}
          />
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <Progress value={progress} className="w-20" />
                <p className="text-xs">{Math.round(progress)}%</p>
              </div>
            </div>
          )}
        </div>

        {layoutMode === "list" && (
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEditFile(file)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemoveFile(file.id)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {file.retryCount && file.retryCount > 0 && (
          <div className="absolute bottom-2 left-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetryUpload(file)}
              className="h-6 text-xs"
            >
              Retry
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderUploadedImage = (image: UploadedImage) => {
    const isSelected = selectedImages.includes(image.public_id);

    return (
      <motion.div
        key={image.public_id}
        layout
        className={`
          relative group border rounded-lg overflow-hidden cursor-pointer
          ${layoutMode === "list" ? "flex items-center p-2 space-x-4" : "aspect-square"}
          ${isSelected ? "ring-2 ring-primary" : ""}
        `}
        onClick={() => onSelectImage(image.public_id)}
      >
        <div className={layoutMode === "list" ? "w-16 h-16 flex-shrink-0" : "relative w-full h-full"}>
          <Image
            src={image.secure_url}
            alt={image.original_filename}
            fill
            className="object-cover"
          />
          
          {isSelected && (
            <div className="absolute top-2 left-2">
              <CheckCircle className="h-5 w-5 text-primary bg-white rounded-full" />
            </div>
          )}
        </div>

        {layoutMode === "list" && (
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium truncate">{image.original_filename}</p>
            <p className="text-xs text-muted-foreground">
              {image.width} × {image.height} • {(image.bytes / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onEditImage(image);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteImage(image.public_id);
            }}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {previewFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Files to Upload</h3>
          <Reorder.Group
            axis="y"
            values={previewFiles}
            onReorder={onPreviewFilesReorder}
            className={gridClassName}
          >
            {previewFiles.map(renderPreviewFile)}
          </Reorder.Group>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
          <Reorder.Group
            axis="y"
            values={uploadedImages}
            onReorder={onUploadedImagesReorder}
            className={gridClassName}
          >
            {uploadedImages.map(renderUploadedImage)}
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};

function createFilterString(filters: { brightness: number; contrast: number; saturation: number; blur: number; grayscale: number; sepia: number; hueRotate: number }): string {
  return [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturation}%)`,
    `blur(${filters.blur}px)`,
    `grayscale(${filters.grayscale}%)`,
    `sepia(${filters.sepia}%)`,
    `hue-rotate(${filters.hueRotate}deg)`,
  ].join(" ");
}
