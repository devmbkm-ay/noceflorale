import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Create a FormData instance
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'wedding_photos'); // You can create this in Cloudinary dashboard

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

