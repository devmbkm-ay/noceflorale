import React, { useRef } from "react";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Crop, RotateCw } from "lucide-react";

interface ImageCropperProps {
  src: string;
  crop: CropType;
  onCropChange: (crop: CropType) => void;
  onCropComplete: (crop: PixelCrop) => void;
  onApplyCrop: () => void;
  onReset: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  crop,
  onCropChange,
  onCropComplete,
  onApplyCrop,
  onReset,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Crop Image</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={onApplyCrop}>
            <Crop className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>
      
      <ReactCrop
        crop={crop}
        onChange={onCropChange}
        onComplete={onCropComplete}
        aspect={undefined}
        className="max-w-full"
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop preview"
          className="max-w-full h-auto"
          style={{ maxHeight: "400px" }}
        />
      </ReactCrop>
    </div>
  );
};
