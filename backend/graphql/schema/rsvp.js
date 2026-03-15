// RSVP GraphQL Schema
export const rsvpTypeDefs = `#graphql
  scalar Date

  enum AttendanceStatus {
    attending
    not_attending
  }

  enum EventParticipation {
    none
    both
    blessing_only
    evening_only
  }

  enum GuestType {
    single
    couple
  }

  type Child {
    id: ID
    name: String!
    age: Int!
  }

  input ChildInput {
    id: ID
    name: String!
    age: Int!
  }

  type PrimaryGuest {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    telephone: String
    attending: AttendanceStatus!
    guestType: GuestType!
    eventParticipation: EventParticipation!
    partnerFirstName: String
    partnerLastName: String
    partnerEmail: String
    partnerTelephone: String
    partnerEventParticipation: EventParticipation
    hasChildren: Boolean!
    childrenCount: Int
    children: [Child]
    # dietaryRequirements: String
    # notes: String
    createdAt: Date!
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
  }

  input PrimaryGuestInput {
    firstName: String!
    lastName: String!
    email: String!
    telephone: String
    attending: AttendanceStatus!
    guestType: GuestType!
    eventParticipation: EventParticipation!
    partnerFirstName: String
    partnerLastName: String
    partnerEmail: String
    partnerTelephone: String
    partnerEventParticipation: EventParticipation
    hasChildren: Boolean!
    childrenCount: Int
    children: [ChildInput]
    # dietaryRequirements: String
    # notes: String
  }

  type RsvpStats {
    totalGuests: Int!
    maxCapacity: Int!
    attending: Int!
    notAttending: Int!
    ceremonyOnly: Int!
    receptionOnly: Int!
    both: Int!
    totalAdults: Int!
    totalChildren: Int!
  }

  type EmailCheckResult {
    exists: Boolean!
    guestName: String
    lastModified: String
  }

  type Query {
    # Get a single RSVP by ID
    getRsvp(id: ID!): PrimaryGuest

    # Get all RSVPs with optional filters
    getAllRsvps(
      attending: AttendanceStatus
      eventParticipation: EventParticipation
      search: String
    ): [PrimaryGuest]

    # Get all deleted RSVPs with optional search filter
    getDeletedRsvps(search: String): [PrimaryGuest]

    # Get RSVP statistics
    getRsvpStats: RsvpStats

    # Check if an email already exists in RSVPs
    checkEmailExists(email: String!): EmailCheckResult!
  }

  type FeedbackEmailResult {
    success: Boolean!
    messageId: String
    recipient: String!
    error: String
  }

  input FeedbackEmailInput {
    guestId: ID!
    subject: String!
    message: String!
    fromName: String
  }

  type Mutation {
    # Create a new RSVP
    createRsvp(guest: PrimaryGuestInput!): PrimaryGuest!

    # Update an existing RSVP
    updateRsvp(id: ID!, guest: PrimaryGuestInput!): PrimaryGuest!

    # Delete an RSVP (soft delete)
    deleteRsvp(id: ID!): Boolean!
    
    # Restore a previously deleted RSVP
    restoreRsvp(id: ID!): PrimaryGuest!
    
    # Admin only: migrate partner names for all RSVPs
    migratePartnerNames: Int!
    
    # Send feedback email to a guest
    sendFeedbackToGuest(input: FeedbackEmailInput!): FeedbackEmailResult!
    
    # Test email configuration
    testEmailConfiguration: FeedbackEmailResult!
  }
`;
