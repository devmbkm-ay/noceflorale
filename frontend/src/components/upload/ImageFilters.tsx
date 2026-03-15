import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { ImageFilters as ImageFiltersType } from "./types";

interface ImageFiltersProps {
  filters: ImageFiltersType;
  onFiltersChange: (filters: ImageFiltersType) => void;
  onReset: () => void;
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleFilterChange = (filterName: keyof ImageFiltersType, value: number) => {
    onFiltersChange({
      ...filters,
      [filterName]: value,
    });
  };

  const filterConfigs = [
    { name: "brightness" as const, label: "Brightness", min: 0, max: 200, unit: "%" },
    { name: "contrast" as const, label: "Contrast", min: 0, max: 200, unit: "%" },
    { name: "saturation" as const, label: "Saturation", min: 0, max: 200, unit: "%" },
    { name: "blur" as const, label: "Blur", min: 0, max: 10, unit: "px" },
    { name: "grayscale" as const, label: "Grayscale", min: 0, max: 100, unit: "%" },
    { name: "sepia" as const, label: "Sepia", min: 0, max: 100, unit: "%" },
    { name: "hueRotate" as const, label: "Hue Rotate", min: 0, max: 360, unit: "°" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Image Filters</h4>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      {filterConfigs.map(({ name, label, min, max, unit }) => (
        <div key={name} className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">{label}</Label>
            <span className="text-xs text-muted-foreground">
              {filters[name]}{unit}
            </span>
          </div>
          <Slider
            value={[filters[name]]}
            onValueChange={([value]) => handleFilterChange(name, value)}
            min={min}
            max={max}
            step={1}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};
