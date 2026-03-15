import { FieldPath } from "react-hook-form";
import { type RsvpFormData } from "../validation";
import { AttendanceStatus, EventParticipation, GuestType } from "../types";
import { PrimaryGuestInput } from "@/graphql/rsvp";

// Helper function to validate and prepare guest input data
export const validateAndPrepareGuestInput = (
  data: RsvpFormData,
  attendanceErrorShown: boolean
): PrimaryGuestInput => {
  console.log(
    "🔍 validateAndPrepareGuestInput called with data:",
    JSON.stringify(data, null, 2),
    "ATTENDANCEERROR",
    attendanceErrorShown
  );
  const attending = data.primaryGuest.attending;
  const isAttending = attending === AttendanceStatus.YES;
  const isSingle = data.primaryGuest.guestType === GuestType.SINGLE;

  // Create base input with required fields
  const baseInput: PrimaryGuestInput = {
    firstName: data.primaryGuest.firstName,
    lastName: data.primaryGuest.lastName,
    email: data.primaryGuest.email,
    telephone: data.primaryGuest.telephone, // Include telephone field
    attending: isAttending ? "attending" : "not_attending",
    guestType: isAttending
      ? data.primaryGuest.guestType === GuestType.COUPLE
        ? "couple"
        : "single"
      : "single",
    eventParticipation: isAttending
      ? data.primaryGuest.eventParticipation === EventParticipation.BOTH
        ? "both"
        : data.primaryGuest.eventParticipation ===
          EventParticipation.BLESSING_ONLY
        ? "blessing_only"
        : data.primaryGuest.eventParticipation ===
          EventParticipation.EVENING_ONLY
        ? "evening_only"
        : "both" // Fallback to "both" if somehow none of the cases match
      : "none",
    // Force children section to be disabled regardless of user input
    hasChildren: false, // Always false - children section muted
    childrenCount: 0, // Always zero - children section muted
    children: [], // Always empty - children section muted
    // Partner fields are handled separately below
  };

  // For single guests or non-attending guests, ensure partner fields are not included
  if (!isAttending || isSingle) {
    return baseInput;
  }

  // Only set partner info for couples who are attending
  // Handle both separate fields and legacy partnerName field
  if (data.primaryGuest.partnerFirstName || data.primaryGuest.partnerLastName) {
    // Use separate firstName and lastName fields if available
    Object.assign(baseInput, {
      partnerFirstName: data.primaryGuest.partnerFirstName || "",
      partnerLastName: data.primaryGuest.partnerLastName || "",
    });
  } else if (data.primaryGuest.partnerName) {
    // Fallback to legacy partnerName field if separate fields are not available
    Object.assign(baseInput, {
      partnerFirstName: data.primaryGuest.partnerName.split(" ")[0],
      partnerLastName: data.primaryGuest.partnerName
        .split(" ")
        .slice(1)
        .join(" "),
    });
  }

  if (data.primaryGuest.partnerEmail) {
    Object.assign(baseInput, {
      partnerEmail: data.primaryGuest.partnerEmail.toLowerCase(),
    });
  }

  if (data.primaryGuest.partnerTelephone) {
    Object.assign(baseInput, {
      partnerTelephone: data.primaryGuest.partnerTelephone,
    });
  }

  if (data.primaryGuest.partnerEventParticipation) {
    Object.assign(baseInput, {
      partnerEventParticipation: data.primaryGuest.partnerEventParticipation,
    });
  }

  return baseInput;
};

// Field validation mappings
const ATTENDANCE_FIELDS: FieldPath<RsvpFormData>[] = [
  "primaryGuest.firstName",
  "primaryGuest.lastName",
  "primaryGuest.email",
  "primaryGuest.telephone",
  "primaryGuest.attending",
];

const PARTNER_FIELDS: FieldPath<RsvpFormData>[] = [
  "primaryGuest.partnerFirstName",
  "primaryGuest.partnerLastName",
  "primaryGuest.partnerEmail",
  "primaryGuest.partnerEventParticipation",
];

const getFieldsForNonAttending = (step: number): FieldPath<RsvpFormData>[] => {
  return step === 0 ? ATTENDANCE_FIELDS : [];
};

const getFieldsByStepTitle = (stepTitle: string, guestType: GuestType): FieldPath<RsvpFormData>[] => {
  const stepFieldMap: Record<string, FieldPath<RsvpFormData>[]> = {
    "Attendance": ATTENDANCE_FIELDS,
    "Event Participation": ["primaryGuest.eventParticipation"],
    "Guest Type": ["primaryGuest.guestType"],
    "Review": [],
  };

  if (stepTitle === "Partner Info") {
    return guestType === GuestType.COUPLE ? PARTNER_FIELDS : [];
  }

  return stepFieldMap[stepTitle] || [];
};

// Get fields that need validation for the current step based on the flow
export const getFieldsToValidateForStep = (
  step: number,
  attending: AttendanceStatus,
  guestType: GuestType,
  currentSteps: { title: string; component: React.ReactNode }[]
): FieldPath<RsvpFormData>[] => {
  // For the final review step, validate the entire form
  if (step === currentSteps.length - 1) {
    return [];
  }

  // For non-attending guests
  if (attending === AttendanceStatus.NO) {
    return getFieldsForNonAttending(step);
  }

  // For attending guests
  const stepTitle = currentSteps[step]?.title || "";
  return getFieldsByStepTitle(stepTitle, guestType);
};
