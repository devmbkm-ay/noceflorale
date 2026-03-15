// Schedule GraphQL Schema
export const scheduleTypeDefs = `#graphql
  scalar Date
  scalar Time

  type ScheduleItem {
    id: ID!
    title: String!
    description: String
    startTime: String!
    endTime: String
    location: String
    important: Boolean
    order: Int
    createdAt: Date!
    updatedAt: Date
  }

  input ScheduleItemInput {
    title: String!
    description: String
    startTime: String!
    endTime: String
    location: String
    important: Boolean
    order: Int
  }

  type Query {
    # Get a single schedule item by ID
    getScheduleItem(id: ID!): ScheduleItem
    
    # Get all schedule items
    scheduleItems: [ScheduleItem]
  }

  type Mutation {
    # Create a new schedule item
    createScheduleItem(item: ScheduleItemInput!): ScheduleItem!
    
    # Update an existing schedule item
    updateScheduleItem(id: ID!, item: ScheduleItemInput!): ScheduleItem!
    
    # Delete a schedule item
    deleteScheduleItem(id: ID!): Boolean!
  }
`;

