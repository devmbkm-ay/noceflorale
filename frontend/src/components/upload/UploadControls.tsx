import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Grid, 
  List, 
  Trash2, 
  CheckSquare, 
  Square,
  Filter,
  Crop,
  Settings,
  Download
} from "lucide-react";
import { LayoutMode } from "./types";

interface UploadControlsProps {
  // File counts
  previewFilesCount: number;
  uploadedImagesCount: number;
  selectedImagesCount: number;
  
  // Upload state
  uploading: boolean;
  isCompressing: boolean;
  compressionProgress: number;
  
  // Layout and view
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  
  // Actions
  onUpload: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onOpenFilters?: () => void;
  onOpenCropping?: () => void;
  onOpenSettings?: () => void;
  onExport?: () => void;
  
  // Feature toggles
  enableBulkActions?: boolean;
  enableFilters?: boolean;
  enableCropping?: boolean;
  enableExport?: boolean;
  
  // Disabled states
  disabled?: boolean;
}

export const UploadControls: React.FC<UploadControlsProps> = ({
  previewFilesCount,
  uploadedImagesCount,
  selectedImagesCount,
  uploading,
  isCompressing,
  compressionProgress,
  layoutMode,
  onLayoutModeChange,
  onUpload,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onOpenFilters,
  onOpenCropping,
  onOpenSettings,
  onExport,
  enableBulkActions = true,
  enableFilters = true,
  enableCropping = true,
  enableExport = true,
  disabled = false,
}) => {
  const hasPreviewFiles = previewFilesCount > 0;
  const hasUploadedImages = uploadedImagesCount > 0;
  const hasSelectedImages = selectedImagesCount > 0;
  const allImagesSelected = hasUploadedImages && selectedImagesCount === uploadedImagesCount;

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {hasPreviewFiles && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {previewFilesCount} file(s) ready to upload
            </div>
            <Button
              onClick={onUpload}
              disabled={uploading || isCompressing || disabled}
              className="min-w-[120px]"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>

          {/* Compression Progress */}
          {isCompressing && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Compressing images...</span>
                <span>{Math.round(compressionProgress)}%</span>
              </div>
              <Progress value={compressionProgress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        {/* Layout Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={layoutMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onLayoutModeChange("grid")}
            disabled={disabled}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onLayoutModeChange("list")}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Filter Button */}
          {enableFilters && onOpenFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenFilters}
              disabled={disabled}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}

          {/* Cropping Button */}
          {enableCropping && onOpenCropping && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCropping}
              disabled={disabled}
            >
              <Crop className="h-4 w-4 mr-2" />
              Crop
            </Button>
          )}

          {/* Export Button */}
          {enableExport && onExport && hasUploadedImages && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={disabled}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {/* Settings Button */}
          {onOpenSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              disabled={disabled}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {enableBulkActions && hasUploadedImages && (
        <>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={allImagesSelected ? onClearSelection : onSelectAll}
                disabled={disabled}
              >
                {allImagesSelected ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All
                  </>
                )}
              </Button>
              
              {hasSelectedImages && (
                <span className="text-sm text-muted-foreground">
                  {selectedImagesCount} selected
                </span>
              )}
            </div>

            {hasSelectedImages && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteSelected}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedImagesCount})
              </Button>
            )}
          </div>
        </>
      )}

      {/* Status Info */}
      {hasUploadedImages && (
        <div className="text-xs text-muted-foreground text-center">
          {uploadedImagesCount} image(s) uploaded
          {hasSelectedImages && ` • ${selectedImagesCount} selected`}
        </div>
      )}
    </div>
  );
};
