import React, { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneComponentProps {
  onFilesAccepted: (files: File[]) => void;
  onFilesRejected: (rejectedFiles: FileRejection[]) => void;
  accept: Record<string, string[]>;
  maxSize: number;
  maxFiles: number;
  disabled?: boolean;
  className?: string;
}

export const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  onFilesAccepted,
  onFilesRejected,
  accept,
  maxSize,
  maxFiles,
  disabled = false,
  className = "",
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
      if (fileRejections.length > 0) {
        onFilesRejected(fileRejections);
      }
    },
    [onFilesAccepted, onFilesRejected]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-muted">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse files
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={open}
          disabled={disabled}
          className="mt-2"
        >
          Choose Files
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Maximum {maxFiles} files</p>
          <p>Maximum {Math.round(maxSize / (1024 * 1024))}MB per file</p>
          <p>Supported formats: {Object.values(accept).flat().join(", ")}</p>
        </div>
      </div>
    </div>
  );
};
