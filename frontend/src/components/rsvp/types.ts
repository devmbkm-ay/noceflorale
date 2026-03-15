export enum AttendanceStatus {
  YES = "attending",
  NO = "not_attending",
}

export enum EventParticipation {
  NONE = "none",
  BOTH = "both",
  BLESSING_ONLY = "blessing_only",
  EVENING_ONLY = "evening_only",
}

export enum GuestType {
  SINGLE = "single",
  COUPLE = "couple",
}

export interface Child {
  id: string;
  name: string;
  age: number;
}

export interface PrimaryGuest {
  // Primary Guest
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  attending: AttendanceStatus;
  guestType: GuestType;

  // Event Details
  eventParticipation: EventParticipation;

  // Partner (if couple)
  partnerName?: string;
  partnerEmail?: string;
  partnerTelephone?: string;
  partnerEventParticipation?: EventParticipation;

  // Children
  hasChildren: boolean;
  childrenCount: number;
  children: Child[];

  // Additional information
  // dietaryRequirements?: string;
  // notes?: string;
}

export interface RsvpFormData {
  primaryGuest: PrimaryGuest;
  isSubmitting: boolean;
  currentStep: number;
}
