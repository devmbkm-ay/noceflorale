import { GalleryImage } from '../../models/GalleryImage.js';
import { GraphQLError } from "graphql";

export const galleryResolvers = {
  Query: {
    galleryImages: async () => {
      try {
        // Get all gallery images, sorted by order
        const images = await GalleryImage.find({}).sort({ order: 1 });
        return images.map(image => ({
          ...image._doc,
          id: image._id.toString(),
          createdAt: image.createdAt.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        throw new GraphQLError('Failed to fetch gallery images', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    
    galleryImage: async (_, { id }) => {
      try {
        const image = await GalleryImage.findById(id);
        if (!image) {
          throw new GraphQLError(`Gallery image with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        return {
          ...image._doc,
          id: image._id.toString(),
          createdAt: image.createdAt.toISOString()
        };
      } catch (error) {
        console.error(`Error fetching gallery image ${id}:`, error);
        throw new GraphQLError('Failed to fetch gallery image', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  },

  Mutation: {
    createGalleryImage: async (_, { input }) => {
      try {
        // Get the maximum order to place new image at the end
        const maxOrderImage = await GalleryImage.findOne({}).sort({ order: -1 });
        const nextOrder = maxOrderImage ? maxOrderImage.order + 1 : 1;
        
        // Create the new image with the calculated order
        const newImage = new GalleryImage({
          ...input,
          order: nextOrder
        });
        
        const savedImage = await newImage.save();
        
        return {
          ...savedImage._doc,
          id: savedImage._id.toString(),
          createdAt: savedImage.createdAt.toISOString()
        };
      } catch (error) {
        console.error('Error creating gallery image:', error);
        throw new GraphQLError('Failed to create gallery image', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    
    updateGalleryImage: async (_, { id, input }) => {
      try {
        const image = await GalleryImage.findById(id);
        if (!image) {
          throw new GraphQLError(`Gallery image with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        // Update the image with new values
        Object.keys(input).forEach(key => {
          if (input[key] !== undefined) {
            image[key] = input[key];
          }
        });
        
        const updatedImage = await image.save();
        
        return {
          ...updatedImage._doc,
          id: updatedImage._id.toString(),
          createdAt: updatedImage.createdAt.toISOString()
        };
      } catch (error) {
        console.error(`Error updating gallery image ${id}:`, error);
        throw new GraphQLError('Failed to update gallery image', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    
    deleteGalleryImage: async (_, { id }) => {
      try {
        const image = await GalleryImage.findById(id);
        if (!image) {
          throw new GraphQLError(`Gallery image with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        const deletedImage = await GalleryImage.findByIdAndDelete(id);
        
        // Reorder remaining images to keep order consistent
        const remainingImages = await GalleryImage.find({})
          .sort({ order: 1 });
        
        // Update order for all remaining images
        const updates = remainingImages.map((img, index) => {
          return GalleryImage.updateOne(
            { _id: img._id },
            { order: index + 1 }
          );
        });
        
        await Promise.all(updates);
        
        return !!deletedImage;
      } catch (error) {
        console.error(`Error deleting gallery image ${id}:`, error);
        throw new GraphQLError('Failed to delete gallery image', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    
    reorderGalleryImages: async (_, { imageIds }) => {
      try {
        // Verify all images exist
        const images = await GalleryImage.find({
          _id: { $in: imageIds }
        });
        
        if (images.length !== imageIds.length) {
          throw new GraphQLError('One or more gallery images not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        // Update order for all images based on the provided order
        const updates = imageIds.map((id, index) => {
          return GalleryImage.updateOne(
            { _id: id },
            { order: index + 1 }
          );
        });
        
        await Promise.all(updates);
        
        // Fetch and return the updated images
        const updatedImages = await GalleryImage.find({
          _id: { $in: imageIds }
        }).sort({ order: 1 });
        
        return updatedImages.map(image => ({
          ...image._doc,
          id: image._id.toString(),
          createdAt: image.createdAt.toISOString()
        }));
      } catch (error) {
        console.error('Error reordering gallery images:', error);
        throw new GraphQLError('Failed to reorder gallery images', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};

