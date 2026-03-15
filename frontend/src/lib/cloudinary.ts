import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Cloudinary upload options for different image types
export const uploadOptions = {
  wedding: {
    folder: "noce-florale/wedding-photos",
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" },
      { width: 1920, height: 1080, crop: "limit" },
    ],
    tags: ["wedding", "noce-florale"],
  },
  gallery: {
    folder: "noce-florale/gallery",
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
      { width: 1200, height: 800, crop: "fill", gravity: "auto" },
    ],
    tags: ["gallery", "noce-florale"],
  },
  thumbnails: {
    folder: "noce-florale/thumbnails",
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" },
      { width: 400, height: 300, crop: "fill", gravity: "auto" },
    ],
    tags: ["thumbnail", "noce-florale"],
  },
  rsvp: {
    folder: "noce-florale/rsvp-media",
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" },
      { width: 800, height: 600, crop: "limit" },
    ],
    tags: ["rsvp", "noce-florale"],
  },
};

// Helper function to generate optimized URLs
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
) => {
  const {
    width = 800,
    height = 600,
    quality = "auto:good",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { quality },
      { fetch_format: format },
      { width, height, crop, gravity },
    ],
  });
};

export default cloudinary;
