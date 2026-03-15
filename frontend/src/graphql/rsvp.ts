import { gql } from "@apollo/client";

// Fragment for common RSVP fields
export const RSVP_FIELDS = gql`
  fragment RsvpFields on PrimaryGuest {
    id
    firstName
    lastName
    email
    telephone
    attending
    guestType
    eventParticipation
    partnerFirstName
    partnerLastName
    partnerEmail
    partnerTelephone
    partnerEventParticipation
    hasChildren
    childrenCount
    children {
      id
      name
      age
    }
    # dietaryRequirements
    # notes
    createdAt
    updatedAt
  }
`;

// Query to get a single RSVP by ID
export const GET_RSVP = gql`
  query GetRsvp($id: ID!) {
    getRsvp(id: $id) {
      ...RsvpFields
    }
  }
  ${RSVP_FIELDS}
`;

// Query to get all RSVPs with filters
export const GET_ALL_RSVPS = gql`
  query GetAllRsvps(
    $attending: AttendanceStatus
    $eventParticipation: EventParticipation
    $search: String
  ) {
    getAllRsvps(
      attending: $attending
      eventParticipation: $eventParticipation
      search: $search
    ) {
      ...RsvpFields
    }
  }
  ${RSVP_FIELDS}
`;

// Query to get all deleted RSVPs with optional search filter
export const GET_DELETED_RSVPS = gql`
  query GetDeletedRsvps($search: String) {
    getDeletedRsvps(search: $search) {
      ...RsvpFields
    }
  }
  ${RSVP_FIELDS}
`;

// Query to get RSVP statistics
export const GET_RSVP_STATS = gql`
  query GetRsvpStats {
    getRsvpStats {
      totalGuests
      maxCapacity
      attending
      notAttending
      ceremonyOnly
      receptionOnly
      maxCapacity
      both
      totalAdults
      totalChildren
    }
  }
`;

// Mutation to create a new RSVP
export const CREATE_RSVP = gql`
  mutation CreateRsvp($guest: PrimaryGuestInput!) {
    createRsvp(guest: $guest) {
      id
      firstName
      lastName
      email
      telephone
      attending
      guestType
      eventParticipation
      partnerFirstName
      partnerLastName
      partnerEmail
      partnerTelephone
      partnerEventParticipation
      hasChildren
      childrenCount
      children {
        id
        name
        age
      }
      createdAt
    }
  }
`;

// Mutation to update an existing RSVP
export const UPDATE_RSVP = gql`
  mutation UpdateRsvp($id: ID!, $guest: PrimaryGuestInput!) {
    updateRsvp(id: $id, guest: $guest) {
      ...RsvpFields
    }
  }
  ${RSVP_FIELDS}
`;

// Mutation to delete an RSVP
export const DELETE_RSVP = gql`
  mutation DeleteRsvp($id: ID!) {
    deleteRsvp(id: $id)
  }
`;

export const SEND_FEEDBACK_TO_GUEST = gql`
  mutation SendFeedbackToGuest($input: FeedbackEmailInput!) {
    sendFeedbackToGuest(input: $input) {
      success
      messageId
      recipient
      error
    }
  }
`;

export const TEST_EMAIL_CONFIGURATION = gql`
  mutation TestEmailConfiguration {
    testEmailConfiguration {
      success
      messageId
      recipient
      error
    }
  }
`;

// Mutation to restore a deleted RSVP
export const RESTORE_RSVP = gql`
  mutation RestoreRsvp($id: ID!) {
    restoreRsvp(id: $id)
  }
`;

// Admin mutation to fix partner names
export const MIGRATE_PARTNER_NAMES = gql`
  mutation MigratePartnerNames {
    migratePartnerNames
  }
`;

// Input type for RSVP child
export interface ChildInput {
  name: string;
  age: number;
}

// Input type for creating/updating RSVPs
export interface PrimaryGuestInput {
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  attending: "attending" | "not_attending";
  guestType: "single" | "couple";
  eventParticipation: "both" | "blessing_only" | "evening_only" | "none";
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerEmail?: string;
  partnerTelephone?: string;
  partnerEventParticipation?:
    | "both"
    | "blessing_only"
    | "evening_only"
    | "none";
  hasChildren: boolean;
  childrenCount: number;
  children: ChildInput[];
  // dietaryRequirements?: string;
  // notes?: string;
}

// Type for RSVP statistics
export interface RsvpStats {
  totalGuests: number;
  maxCapacity: number;
  attending: number;
  notAttending: number;
  ceremonyOnly: number;
  receptionOnly: number;
  both: number;
  totalAdults: number;
  totalChildren: number;
}

// Type for RSVP data
export interface Rsvp {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  attending: "attending" | "not_attending";
  guestType: "single" | "couple";
  eventParticipation: "both" | "blessing_only" | "evening_only" | "none";
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerName?: string; // Computed field for compatibility
  partnerEmail?: string;
  partnerTelephone?: string;
  partnerEventParticipation?:
    | "both"
    | "blessing_only"
    | "evening_only"
    | "none";
  hasChildren: boolean;
  childrenCount?: number;
  children?: {
    id: string;
    name: string;
    age: number;
  }[];
  // dietaryRequirements?: string;
  // notes?: string;
  createdAt: string;
  updatedAt?: string;
}
// Add this query to check if email exists
export const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email) {
      exists
      guestName
      lastModified
    }
  }
`;
