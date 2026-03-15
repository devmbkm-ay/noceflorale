export const galleryTypeDefs = `#graphql
  # GalleryImage type definition
  type GalleryImage {
    id: ID!
    src: String!
    alt: String!
    caption: String
    order: Int!
    isActive: Boolean!
    createdAt: String!
  }

  # Input type for creating a new gallery image
  input GalleryImageInput {
    src: String!
    alt: String!
    caption: String
    isActive: Boolean = true
  }

  # Input type for updating an existing gallery image
  input UpdateGalleryImageInput {
    src: String
    alt: String
    caption: String
    order: Int
    isActive: Boolean
  }
`

export const galleryQueryDefs = `#graphql
  # Gallery-specific queries
  galleryImages: [GalleryImage!]!
  galleryImage(id: ID!): GalleryImage
`

export const galleryMutationDefs = `#graphql
  # Gallery-specific mutations
  createGalleryImage(input: GalleryImageInput!): GalleryImage!
  updateGalleryImage(id: ID!, input: UpdateGalleryImageInput!): GalleryImage!
  deleteGalleryImage(id: ID!): Boolean!
  reorderGalleryImages(imageIds: [ID!]!): [GalleryImage!]!
`

