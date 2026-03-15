import { gql } from "@apollo/client";

export const GET_GALLERY_IMAGES = gql`
  query GetGalleryImages {
    galleryImages {
      id
      src
      alt
      caption
      order
      isActive
      createdAt
    }
  }
`;

export const CREATE_GALLERY_IMAGE = gql`
  mutation CreateGalleryImage($input: GalleryImageInput!) {
    createGalleryImage(input: $input) {
      id
      src
      alt
      caption
      order
      isActive
      createdAt
    }
  }
`;

export const UPDATE_GALLERY_IMAGE = gql`
  mutation UpdateGalleryImage($id: ID!, $input: UpdateGalleryImageInput!) {
    updateGalleryImage(id: $id, input: $input) {
      id
      src
      alt
      caption
      order
      isActive
      createdAt
    }
  }
`;

export const DELETE_GALLERY_IMAGE = gql`
  mutation DeleteGalleryImage($id: ID!) {
    deleteGalleryImage(id: $id)
  }
`;

export const REORDER_GALLERY_IMAGES = gql`
  mutation ReorderGalleryImages($imageIds: [ID!]!) {
    reorderGalleryImages(imageIds: $imageIds) {
      id
      order
    }
  }
`;
