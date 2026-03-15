import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { DropzoneComponent } from "./DropzoneComponent";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { UploadControls } from "./UploadControls";
import { ImageFilters } from "./ImageFilters";
import { useImageUpload } from "./useImageUpload";
import { ImageUploadProps, UploadedImage } from "./types";
import { resetFilters } from "./uploadUtils";

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const {
    className = "",
    maxFiles = 10,
    accept = { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxSize = 10 * 1024 * 1024,
    enableImageCropping = true,
    enableImageFilters = true,
    enableBulkActions = true,
  } = props;

  // Modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  // Use the custom hook for upload logic
  const {
    uploadedImages,
    previewFiles,
    isCompressing,
    compressionProgress,
    rejectedFiles,
    selectedImages,
    layoutMode,
    defaultFilters,
    uploading,
    fileProgresses,
    handleFilesAccepted,
    handleFilesRejected,
    uploadFiles,
    removePreviewFile,
    removeUploadedImage,
    toggleImageSelection,
    handlePreviewFilesReorder,
    handleUploadedImagesReorder,
    retryUpload,
    selectAllImages,
    clearSelection,
    deleteSelectedImages,
    setLayoutMode,
    setDefaultFilters,
  } = useImageUpload(props);

  // Handle filter reset
  const handleFilterReset = () => {
    setDefaultFilters(resetFilters());
  };

  // Handle file editing (placeholder for now)
  const handleEditFile = (file: File) => {
    // This would open an edit modal for the file
    console.log("Edit file:", file);
  };

  // Handle image editing (placeholder for now)
  const handleEditImage = (image: UploadedImage) => {
    // This would open an edit modal for the image
    console.log("Edit image:", image);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Display */}
      {rejectedFiles.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {rejectedFiles.length} file(s) were rejected. Check the file requirements.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Upload Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Controls */}
          <UploadControls
            previewFilesCount={previewFiles.length}
            uploadedImagesCount={uploadedImages.length}
            selectedImagesCount={selectedImages.length}
            uploading={uploading}
            isCompressing={isCompressing}
            compressionProgress={compressionProgress}
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
            onUpload={uploadFiles}
            onSelectAll={selectAllImages}
            onClearSelection={clearSelection}
            onDeleteSelected={deleteSelectedImages}
            onOpenFilters={enableImageFilters ? () => setIsFilterModalOpen(true) : undefined}
            onOpenCropping={enableImageCropping ? () => setIsCropModalOpen(true) : undefined}
            enableBulkActions={enableBulkActions}
            enableFilters={enableImageFilters}
            enableCropping={enableImageCropping}
          />

          {/* Dropzone */}
          {(previewFiles.length === 0 && uploadedImages.length === 0) || previewFiles.length < maxFiles ? (
            <DropzoneComponent
              onFilesAccepted={handleFilesAccepted}
              onFilesRejected={handleFilesRejected}
              accept={accept}
              maxSize={maxSize}
              maxFiles={maxFiles}
              disabled={uploading || isCompressing}
            />
          ) : null}

          {/* Image Preview Grid */}
          {(previewFiles.length > 0 || uploadedImages.length > 0) && (
            <ImagePreviewGrid
              previewFiles={previewFiles}
              uploadedImages={uploadedImages}
              selectedImages={selectedImages}
              layoutMode={layoutMode}
              uploading={uploading}
              fileProgresses={fileProgresses}
              onPreviewFilesReorder={handlePreviewFilesReorder}
              onUploadedImagesReorder={handleUploadedImagesReorder}
              onSelectImage={toggleImageSelection}
              onEditFile={handleEditFile}
              onEditImage={handleEditImage}
              onRemoveFile={removePreviewFile}
              onDeleteImage={removeUploadedImage}
              onRetryUpload={retryUpload}
            />
          )}
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Default Image Filters</DialogTitle>
          </DialogHeader>
          <ImageFilters
            filters={defaultFilters}
            onFiltersChange={setDefaultFilters}
            onReset={handleFilterReset}
          />
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Images</DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground">
            Cropping functionality will be available soon.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
