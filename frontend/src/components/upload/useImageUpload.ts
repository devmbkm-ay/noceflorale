import { useState, useCallback } from "react";
import { FileRejection } from "react-dropzone";
import { toast } from "@/utils/safeToast";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { 
  PreviewFile, 
  UploadedImage, 
  FileWithError, 
  ImageFilters,
  LayoutMode,
  ImageUploadProps 
} from "./types";
import { 
  generateImagePreview, 
  compressImage, 
  validateFile,
  generateFileId,
  createDefaultFilters,
  batchProcessFiles
} from "./uploadUtils";

export const useImageUpload = (props: ImageUploadProps) => {
  const {
    onUploadComplete,
    onOrderChange,
    maxFiles = 10,
    uploadType = "general",
    accept = { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxSize = 10 * 1024 * 1024,
    compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      quality: 0.8,
    },
    initialLayoutMode = "grid",
  } = props;

  // State management
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [rejectedFiles, setRejectedFiles] = useState<FileWithError[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(initialLayoutMode);
  const [defaultFilters, setDefaultFilters] = useState<ImageFilters>(createDefaultFilters());

  // Cloudinary upload hook
  const {
    uploadSingle,
    uploadMultiple,
    deleteImage,
    uploading,
    progress,
    fileProgresses,
    clearProgress,
  } = useCloudinaryUpload();

  // Generate previews for files
  const generatePreviews = useCallback(
    async (files: File[]): Promise<PreviewFile[]> => {
      return batchProcessFiles(files, async (file) => {
        const preview = await generateImagePreview(file);
        return {
          ...file,
          id: generateFileId(file),
          preview,
          filters: { ...defaultFilters },
          altText: file.name.split(".")[0],
          retryCount: 0,
        } as PreviewFile;
      });
    },
    [defaultFilters]
  );

  // Handle file validation and acceptance
  const handleFilesAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      // Validate total file count
      const totalFiles = previewFiles.length + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed. ${totalFiles - maxFiles} files will be ignored.`);
        acceptedFiles = acceptedFiles.slice(0, maxFiles - previewFiles.length);
      }

      // Validate each file
      const validFiles: File[] = [];
      const invalidFiles: FileWithError[] = [];

      acceptedFiles.forEach((file) => {
        const validation = validateFile(file, accept, maxSize);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({
            ...file,
            id: generateFileId(file),
            errors: validation.errors.map(error => ({ code: 'validation', message: error })),
          });
        }
      });

      // Update rejected files
      if (invalidFiles.length > 0) {
        setRejectedFiles(prev => [...prev, ...invalidFiles]);
        invalidFiles.forEach(file => {
          file.errors.forEach(error => toast.error(`${file.name}: ${error.message}`));
        });
      }

      // Process valid files
      if (validFiles.length > 0) {
        await prepareFilesForUpload(validFiles);
      }
    },
    [previewFiles.length, maxFiles, accept, maxSize]
  );

  // Handle file rejection
  const handleFilesRejected = useCallback((fileRejections: FileRejection[]) => {
    const rejectedWithErrors: FileWithError[] = fileRejections.map((rejection) => ({
      ...rejection.file,
      id: generateFileId(rejection.file),
      errors: rejection.errors.map(error => ({ code: error.code, message: error.message })),
    }));

    setRejectedFiles(prev => [...prev, ...rejectedWithErrors]);

    // Show error messages
    rejectedWithErrors.forEach(file => {
      file.errors.forEach(error => toast.error(`${file.name}: ${error.message}`));
    });
  }, []);

  // Prepare files for upload (compression)
  const prepareFilesForUpload = useCallback(
    async (files: File[]) => {
      setIsCompressing(true);
      setCompressionProgress(0);

      try {
        // Generate previews first
        const previews = await generatePreviews(files);
        setPreviewFiles(prev => [...prev, ...previews]);

        // Compress files
        const compressedFiles = await batchProcessFiles(
          files,
          (file) => compressImage(file, compressionOptions),
          setCompressionProgress
        );

        return compressedFiles;
      } catch (error) {
        console.error("Error preparing files:", error);
        toast.error("Error preparing files for upload");
        return files;
      } finally {
        setIsCompressing(false);
      }
    },
    [compressionOptions, generatePreviews]
  );

  // Upload files
  const uploadFiles = useCallback(async () => {
    if (previewFiles.length === 0) {
      toast.error("No files to upload");
      return;
    }

    try {
      const files = previewFiles.map(pf => new File([pf], pf.name, { type: pf.type }));
      const results = await uploadMultiple(files, { type: uploadType });
      
      if (results.length > 0) {
        setUploadedImages(prev => [...prev, ...results]);
        setPreviewFiles([]);
        clearProgress();
        onUploadComplete?.(results);
        toast.success(`Successfully uploaded ${results.length} file(s)`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    }
  }, [previewFiles, uploadMultiple, uploadType, clearProgress, onUploadComplete]);

  // Remove preview file
  const removePreviewFile = useCallback((id: string) => {
    setPreviewFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  // Remove uploaded image
  const removeUploadedImage = useCallback(async (publicId: string) => {
    try {
      await deleteImage(publicId);
      setUploadedImages(prev => prev.filter(img => img.public_id !== publicId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  }, [deleteImage]);

  // Handle image selection
  const toggleImageSelection = useCallback((publicId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(publicId)) {
        return prev.filter(id => id !== publicId);
      } else {
        return [...prev, publicId];
      }
    });
  }, []);

  // Handle reordering
  const handlePreviewFilesReorder = useCallback((reorderedFiles: PreviewFile[]) => {
    setPreviewFiles(reorderedFiles);
  }, []);

  const handleUploadedImagesReorder = useCallback((reorderedImages: UploadedImage[]) => {
    setUploadedImages(reorderedImages);
    onOrderChange?.(reorderedImages);
  }, [onOrderChange]);

  // Retry upload for failed file
  const retryUpload = useCallback(async (file: PreviewFile) => {
    const updatedFile = { ...file, retryCount: (file.retryCount || 0) + 1 };
    setPreviewFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
    
    try {
      const compressedFile = await compressImage(
        new File([file], file.name, { type: file.type }),
        compressionOptions
      );
      const result = await uploadSingle(compressedFile, { type: uploadType });
      
      if (result) {
        setUploadedImages(prev => [...prev, result]);
        setPreviewFiles(prev => prev.filter(f => f.id !== file.id));
        toast.success(`Successfully uploaded ${file.name}`);
      }
    } catch (error) {
      console.error("Retry upload error:", error);
      toast.error(`Failed to retry upload for ${file.name}`);
    }
  }, [compressionOptions, uploadSingle, uploadType]);

  // Clear rejected files
  const clearRejectedFiles = useCallback(() => {
    setRejectedFiles([]);
  }, []);

  // Select all images
  const selectAllImages = useCallback(() => {
    setSelectedImages(uploadedImages.map(img => img.public_id));
  }, [uploadedImages]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedImages([]);
  }, []);

  // Delete selected images
  const deleteSelectedImages = useCallback(async () => {
    if (selectedImages.length === 0) return;

    try {
      await Promise.all(selectedImages.map(publicId => deleteImage(publicId)));
      setUploadedImages(prev => prev.filter(img => !selectedImages.includes(img.public_id)));
      setSelectedImages([]);
      toast.success(`Deleted ${selectedImages.length} image(s)`);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete selected images");
    }
  }, [selectedImages, deleteImage]);

  return {
    // State
    uploadedImages,
    previewFiles,
    isCompressing,
    compressionProgress,
    rejectedFiles,
    selectedImages,
    layoutMode,
    defaultFilters,
    
    // Cloudinary state
    uploading,
    progress,
    fileProgresses,
    
    // Actions
    handleFilesAccepted,
    handleFilesRejected,
    uploadFiles,
    removePreviewFile,
    removeUploadedImage,
    toggleImageSelection,
    handlePreviewFilesReorder,
    handleUploadedImagesReorder,
    retryUpload,
    clearRejectedFiles,
    selectAllImages,
    clearSelection,
    deleteSelectedImages,
    setLayoutMode,
    setDefaultFilters,
  };
};
