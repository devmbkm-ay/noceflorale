// Wedding Details GraphQL Schema
export const weddingDetailsTypeDefs = `#graphql
  scalar Date

  type WeddingDetails {
    id: ID!
    ceremonyDate: String!
    ceremonyTime: String!
    ceremonyLocation: String!
    ceremonyAddress: String!
    receptionTime: String!
    receptionLocation: String!
    receptionAddress: String!
    additionalInfo: String
    updatedAt: Date
  }

  input WeddingDetailsInput {
    ceremonyDate: String
    ceremonyTime: String
    ceremonyLocation: String
    ceremonyAddress: String
    receptionTime: String
    receptionLocation: String
    receptionAddress: String
    additionalInfo: String
  }

  type Query {
    # Get wedding details
    getWeddingDetails: WeddingDetails
  }

  type Mutation {
    # Update wedding details
    updateWeddingDetails(input: WeddingDetailsInput!): WeddingDetails!
  }
`;

