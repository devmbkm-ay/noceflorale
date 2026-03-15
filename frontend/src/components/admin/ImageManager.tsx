import React from "react";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { UploadedImage } from "@/components/upload/types";
const ImageManager: React.FC = () => {
  const handleUploadComplete = (results: UploadedImage[]) => {
    console.log("Upload completed:", results);
    // Handle the uploaded images (save to database, update state, etc.)
  };
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Photos de mariage</h2>
        <ImageUpload
          uploadType='wedding'
          maxFiles={20}
          onUploadComplete={handleUploadComplete}
          className='max-w-4xl'
        />
      </div>

      <div>
        <h2 className='text-2xl font-bold mb-4'>Images de galerie</h2>
        <ImageUpload
          uploadType='gallery'
          maxFiles={50}
          onUploadComplete={handleUploadComplete}
          className='max-w-4xl'
        />
      </div>
    </div>
  );
};

export default ImageManager;
