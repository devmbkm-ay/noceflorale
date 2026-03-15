"use client";

import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { UploadedImage } from "@/components/upload/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Trash2, 
  ImageIcon, 
  CameraIcon, 
  SlidersHorizontal, 
  BookOpen, 
  Layers 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define preset compression options
const compressionPresets = {
  high: {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    quality: 0.9,
  },
  medium: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
  },
  low: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    quality: 0.7,
  },
  thumbnail: {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 800,
    quality: 0.6,
  }
};

// Define gallery types and their configurations
type GalleryType = "wedding" | "gallery" | "thumbnail" | "rsvp";

interface GalleryConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  maxFiles: number;
  compressionPreset: keyof typeof compressionPresets;
  uploadType: GalleryType;
}

const galleryConfigs: Record<GalleryType, GalleryConfig> = {
  wedding: {
    title: "Wedding Photos",
    description: "Upload high-quality wedding photos for the main gallery",
    icon: <CameraIcon className="h-5 w-5" />,
    maxFiles: 50,
    compressionPreset: "high",
    uploadType: "wedding"
  },
  gallery: {
    title: "Event Gallery",
    description: "Upload photos for the event gallery section",
    icon: <ImageIcon className="h-5 w-5" />,
    maxFiles: 30,
    compressionPreset: "medium",
    uploadType: "gallery"
  },
  thumbnail: {
    title: "Thumbnails",
    description: "Upload smaller images for thumbnails and previews",
    icon: <Layers className="h-5 w-5" />,
    maxFiles: 20,
    compressionPreset: "thumbnail",
    uploadType: "thumbnail"
  },
  rsvp: {
    title: "RSVP Images",
    description: "Upload images for the RSVP section",
    icon: <BookOpen className="h-5 w-5" />,
    maxFiles: 10,
    compressionPreset: "low",
    uploadType: "rsvp"
  }
};

const GalleryManager: React.FC = () => {
  // State for each gallery type
  const [galleryImages, setGalleryImages] = useState<Record<GalleryType, UploadedImage[]>>({
    wedding: [],
    gallery: [],
    thumbnail: [],
    rsvp: []
  });
  
  // Selected compression preset for custom tab
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof compressionPresets>("medium");
  
  // Handle image upload completion
  const handleUploadComplete = useCallback((type: GalleryType) => (newImages: UploadedImage[]) => {
    setGalleryImages(prev => ({
      ...prev,
      [type]: [...prev[type], ...newImages]
    }));
    
    // Show success message
    toast.success(`${newImages.length} images added to ${galleryConfigs[type].title}`);
  }, []);
  
  // Handle image order changes
  const handleOrderChange = useCallback((type: GalleryType) => (reorderedImages: UploadedImage[]) => {
    setGalleryImages(prev => ({
      ...prev,
      [type]: reorderedImages
    }));
    
    // Optional: Save the new order to your backend
    console.log(`Order changed for ${type}:`, reorderedImages.map(img => img.public_id));
  }, []);
  
  // Simulate saving gallery changes
  const saveGalleryChanges = useCallback((type: GalleryType) => {
    toast.promise(
      // Simulate API call with a promise
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Saving ${galleryConfigs[type].title} changes...`,
        success: `${galleryConfigs[type].title} changes saved successfully!`,
        error: 'Failed to save changes'
      }
    );
  }, []);
  
  // Clear all images for a gallery type
  const clearGallery = useCallback((type: GalleryType) => {
    if (confirm(`Are you sure you want to clear all images from ${galleryConfigs[type].title}?`)) {
      setGalleryImages(prev => ({
        ...prev,
        [type]: []
      }));
      toast.success(`${galleryConfigs[type].title} cleared`);
    }
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Gallery Manager</h1>
      <p className="text-gray-500 mb-6">
        Upload, organize, and manage images across different gallery sections
      </p>
      
      <Tabs defaultValue="wedding" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(galleryConfigs).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              {config.icon}
              <span className="hidden md:inline">{config.title}</span>
            </TabsTrigger>
          ))}
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="hidden md:inline">Custom</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Create a tab content for each gallery type */}
        {Object.entries(galleryConfigs).map(([key, config]) => {
          const type = key as GalleryType;
          return (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {config.icon}
                      {config.title}
                    </CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => saveGalleryChanges(type)}
                      disabled={galleryImages[type].length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => clearGallery(type)}
                      disabled={galleryImages[type].length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-1 bg-gray-50 rounded-lg mb-4">
                    <div className="flex justify-between items-center text-sm p-2">
                      <span className="font-medium">Compression Settings:</span>
                      <span className="text-blue-600">
                        {compressionPresets[config.compressionPreset].maxWidthOrHeight}px • 
                        {compressionPresets[config.compressionPreset].quality * 100}% Quality • 
                        Max {compressionPresets[config.compressionPreset].maxSizeMB}MB
                      </span>
                    </div>
                  </div>
                  
                  <ImageUpload
                    uploadType={config.uploadType}
                    maxFiles={config.maxFiles}
                    compressionOptions={compressionPresets[config.compressionPreset]}
                    onUploadComplete={handleUploadComplete(type)}
                    onOrderChange={handleOrderChange(type)}
                    className="mt-4"
                  />
                </CardContent>
              </Card>
              
              {galleryImages[type].length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery Statistics</CardTitle>
                    <CardDescription>
                      Overview of your {config.title.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium">Total Images</p>
                        <p className="text-2xl font-bold">{galleryImages[type].length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">Total Size</p>
                        <p className="text-2xl font-bold">
                          {(galleryImages[type].reduce((sum, img) => sum + img.bytes, 0) / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-purple-800 text-sm font-medium">Avg. Dimensions</p>
                        <p className="text-2xl font-bold">
                          {Math.round(galleryImages[type].reduce((sum, img) => sum + img.width, 0) / galleryImages[type].length)}
                          × 
                          {Math.round(galleryImages[type].reduce((sum, img) => sum + img.height, 0) / galleryImages[type].length)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
        
        {/* Custom tab with configurable compression */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Custom Upload
                </CardTitle>
                <CardDescription>
                  Upload images with custom compression settings
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Compression: {selectedPreset}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Preset</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(compressionPresets).map(([key, preset]) => (
                    <DropdownMenuItem 
                      key={key}
                      onClick={() => setSelectedPreset(key as keyof typeof compressionPresets)}
                    >
                      <span className="font-medium capitalize">{key}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({preset.maxWidthOrHeight}px, {preset.quality * 100}%)
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Current Compression Settings:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Max Size</p>
                    <p className="font-medium">{compressionPresets[selectedPreset].maxSizeMB} MB</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Max Dimensions</p>
                    <p className="font-medium">{compressionPresets[selectedPreset].maxWidthOrHeight}px</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Quality</p>
                    <p className="font-medium">{compressionPresets[selectedPreset].quality * 100}%</p>
                  </div>
                </div>
              </div>
              
              <ImageUpload
                uploadType="general"
                maxFiles={20}
                compressionOptions={compressionPresets[selectedPreset]}
                onUploadComplete={(images) => {
                  toast.success(`${images.length} images uploaded with ${selectedPreset} compression`);
                }}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-10" />
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-2">Using the Enhanced Image Upload</h2>
        <p className="text-blue-600 mb-4">
          This page demonstrates all the enhanced features of the ImageUpload component:
        </p>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>Image compression with different presets for each gallery type</li>
          <li>Progress tracking for individual files during upload</li>
          <li>Drag-and-drop reordering of uploaded images</li>
          <li>Preview generation before upload</li>
          <li>State management for different gallery types</li>
          <li>Responsive layout with Tailwind CSS</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryManager;

