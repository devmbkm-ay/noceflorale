import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UploadOptions {
  type?: "wedding" | "gallery" | "thumbnail" | "rsvp" | "general";
  alt?: string;
  caption?: string;
  onProgress?: (progress: number, index?: number) => void;
}

interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export interface FileUploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  previewUrl?: string;
}

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileProgresses, setFileProgresses] = useState<FileUploadProgress[]>([]);

  const uploadSingle = useCallback(
    async (
      file: File,
      options: UploadOptions = {}
    ): Promise<UploadResult | null> => {
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", options.type || "general");
        if (options.alt) formData.append("alt", options.alt);
        if (options.caption) formData.append("caption", options.caption);

        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              setProgress(percentComplete);
              if (options.onProgress) {
                options.onProgress(percentComplete);
              }
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                toast.success("Image uploaded successfully!");
                resolve(response.data);
              } else {
                toast.error("Upload failed");
                reject(new Error(response.error));
              }
            } else {
              toast.error("Upload failed");
              reject(new Error(`HTTP ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => {
            toast.error("Upload failed");
            reject(new Error("Network error"));
          });

          xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/upload/single`);
          xhr.send(formData);
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed");
        return null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    []
  );

  const uploadMultiple = useCallback(
    async (
      files: File[],
      options: UploadOptions = {}
    ): Promise<UploadResult[]> => {
      setUploading(true);
      setProgress(0);
      
      // Initialize file progress tracking
      const initialProgresses = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        filename: file.name,
        progress: 0,
        status: 'pending' as const,
        previewUrl: undefined
      }));
      
      setFileProgresses(initialProgresses);

      try {
        // Upload files sequentially with individual progress tracking
        const results: UploadResult[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setFileProgresses(prev => 
            prev.map((p, idx) => 
              idx === i 
                ? { ...p, status: 'uploading' } 
                : p
            )
          );
          
          try {
            const result = await uploadSingle(file, {
              ...options,
              onProgress: (progress) => {
                setFileProgresses(prev => 
                  prev.map((p, idx) => 
                    idx === i 
                      ? { ...p, progress } 
                      : p
                  )
                );
                
                // Calculate overall progress across all files
                const overallProgress = (i + progress / 100) / files.length * 100;
                setProgress(overallProgress);
                
                if (options.onProgress) {
                  options.onProgress(progress, i);
                }
              }
            });
            
            if (result) {
              results.push(result);
              setFileProgresses(prev => 
                prev.map((p, idx) => 
                  idx === i 
                    ? { ...p, progress: 100, status: 'success' } 
                    : p
                )
              );
            } else {
              setFileProgresses(prev => 
                prev.map((p, idx) => 
                  idx === i 
                    ? { ...p, status: 'error', error: 'Upload failed' } 
                    : p
                )
              );
            }
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            setFileProgresses(prev => 
              prev.map((p, idx) => 
                idx === i 
                  ? { ...p, status: 'error', error: 'Upload failed' } 
                  : p
              )
            );
          }
        }
        
        if (results.length > 0) {
          toast.success(`${results.length} images uploaded successfully!`);
          return results;
        } else {
          toast.error("Upload failed");
          return [];
        }
      } catch (error) {
        console.error("Multiple upload error:", error);
        toast.error("Upload failed");
        return [];
      } finally {
        setUploading(false);
        setProgress(0);
        // Reset file progresses after a delay to allow for animations
        setTimeout(() => {
          setFileProgresses([]);
        }, 3000);
      }
    },
    [uploadSingle]
  );

  const deleteImage = useCallback(
    async (publicId: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/${publicId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (result.success) {
          toast.success("Image deleted successfully!");
          return true;
        } else {
          toast.error("Delete failed");
          return false;
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Delete failed");
        return false;
      }
    },
    []
  );

  // Helper function to clear progress tracking
  const clearProgress = useCallback(() => {
    setProgress(0);
    setFileProgresses([]);
  }, []);

  return {
    uploadSingle,
    uploadMultiple,
    deleteImage,
    uploading,
    progress,
    fileProgresses,
    clearProgress,
  };
};
