import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;

