//SDL
// Thi is the schema for the GraphQL API
export const userTypeDefs = `#graphql
  # Define custom scalar types
  scalar Date
  scalar Number

  interface User {
    fullname: String
    email: String
    telephone: String
  }

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getAllAdmins: [Admin]
    getAllGuests: [Guest]
    getAllUsersByRole(role: String!): [User]
    getAllUsersByFullname(fullname: String!): [User]
    getAllUsersByEmail(email: String!): [User]
    getAllUsersByTelephone(telephone: String!): [User]
    getAllUsersByCreatedAt(createdAt: Date!): [User]
    getAllUsersByAttending(attending: Boolean!): [User]
    getAllUsersByNumberOfGuests(numberOfGuests: Number!): [User]
  }

  type Admin implements User {
    fullname: String
    email: String
    telephone: String
    role: String
    createdAt: Date
  }

  type Guest implements User {
    fullname: String
    email: String
    telephone: String
    attending: Boolean
    numberOfGuests: Number
    createdAt: Date
  }
`;
