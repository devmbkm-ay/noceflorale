import mongoose from "mongoose";
import { validateEmail } from "../../../utils/inputSanitizer.js";

// Helper function to ensure all children have IDs
export const ensureChildrenHaveIds = (children) => {
  if (!children || !Array.isArray(children)) return [];

  return children.map((child) => {
    // If child has no id, create a new one using mongoose ObjectId
    if (!child.id) {
      return {
        ...child,
        id: new mongoose.Types.ObjectId().toString(),
      };
    }
    return child;
  });
};

// Helper functions to reduce complexity in validateRsvpData
const sanitizeEmailFields = (data) => {
  if (data.email) {
    data.email = validateEmail(data.email);
  }
  if (data.partnerEmail) {
    data.partnerEmail = validateEmail(data.partnerEmail);
  }
};

// Helper function to split partner name into first and last name
const splitPartnerName = (data) => {
  if (!data.partnerName || data.partnerFirstName || data.partnerLastName) {
    return false;
  }
  
  const nameParts = data.partnerName.trim().split(" ");
  if (nameParts.length > 0) {
    data.partnerFirstName = nameParts[0];
    data.partnerLastName = nameParts.slice(1).join(" ");
  }
  return true;
};

// Helper function to combine partner first and last name
const combinePartnerName = (data) => {
  if (data.partnerName || (!data.partnerFirstName && !data.partnerLastName)) {
    return false;
  }
  
  data.partnerName = `${data.partnerFirstName || ""} ${data.partnerLastName || ""}`.trim();
  return true;
};

// Helper function to set partner name from email
const setPartnerNameFromEmail = (data) => {
  const hasNoPartnerInfo = !data.partnerFirstName && 
                          !data.partnerLastName && 
                          !data.partnerName;
  
  if (!data.partnerEmail || !hasNoPartnerInfo || data.guestType !== "couple") {
    return false;
  }
  
  data.partnerFirstName = data.partnerEmail.split('@')[0] || 'Partner';
  data.partnerLastName = "";
  data.partnerName = data.partnerFirstName;
  return true;
};

// Main function with reduced complexity
const handlePartnerNameCompatibility = (data) => {
  // Try each operation in sequence
  if (splitPartnerName(data)) return;
  if (combinePartnerName(data)) return;
  setPartnerNameFromEmail(data);
};

const handleNonAttendingGuests = (data) => {
  if (data.attending !== "not_attending") return;

  if (data.eventParticipation !== "none") {
    data.eventParticipation = "none";
  }

  if (data.partnerEventParticipation !== undefined) {
    data.partnerEventParticipation = "none";
  }
};

const processChildrenData = (data) => {
  if (data.children && Array.isArray(data.children)) {
    data.children = ensureChildrenHaveIds(data.children);
  }
};

// Helper function to validate and normalize RSVP data
export const validateRsvpData = (guestData) => {
  console.log("Validating and normalizing RSVP data:", JSON.stringify(guestData, null, 2));
  const normalizedData = { ...guestData };

  sanitizeEmailFields(normalizedData);
  handlePartnerNameCompatibility(normalizedData);
  handleNonAttendingGuests(normalizedData);
  processChildrenData(normalizedData);

  console.log("Normalized RSVP data result:", JSON.stringify(normalizedData, null, 2));
  return normalizedData;
};

// Helper function to ensure RSVP objects have required fields
export const normalizeRsvpObject = (rsvp) => {
  // Create a plain object to avoid mongoose document restrictions
  const rsvpObj = rsvp.toObject ? rsvp.toObject() : { ...rsvp };

  // Ensure id field exists and is properly set (required by GraphQL schema)
  if (!rsvpObj.id && rsvpObj._id) {
    rsvpObj.id = rsvpObj._id.toString();
  }

  // Ensure firstName field exists (required by GraphQL schema)
  if (!rsvpObj.firstName) {
    rsvpObj.firstName = rsvpObj.email
      ? rsvpObj.email.split("@")[0]
      : "Guest";
  }

  // Ensure lastName field exists (required by GraphQL schema)
  if (!rsvpObj.lastName) {
    rsvpObj.lastName = "Unknown";
  }

  return rsvpObj;
};

// Helper function to check capacity limits
export const checkCapacityLimit = async (RSVP, newGuestData, existingRsvp = null) => {
  const MAX_CAPACITY = 340;
  
  // Get current RSVP stats (excluding soft-deleted ones)
  const rsvps = await RSVP.find({ deleted: { $ne: true } });

  // Count total attending guests (including partners and children)
  let currentGuestCount = 0;
  rsvps.forEach((rsvp) => {
    if (rsvp.attending === "attending") {
      // Skip the existing RSVP if we're updating
      if (existingRsvp && rsvp._id.equals(existingRsvp._id)) {
        return;
      }

      // Add primary guest
      currentGuestCount++;

      // Add partner if couple
      if (rsvp.guestType === "couple") {
        currentGuestCount++;
      }

      // Add children if any
      if (rsvp.hasChildren && rsvp.children && rsvp.children.length > 0) {
        currentGuestCount += rsvp.children.length;
      }
    }
  });

  // Calculate new guests being added
  let newGuestsCount = 1; // Primary guest
  if (newGuestData.guestType === "couple") {
    newGuestsCount++; // Partner
  }
  if (newGuestData.hasChildren && newGuestData.children && newGuestData.children.length > 0) {
    newGuestsCount += newGuestData.children.length; // Children
  }

  // Check if adding these guests would exceed the capacity
  if (currentGuestCount + newGuestsCount > MAX_CAPACITY) {
    return {
      exceeded: true,
      currentCount: currentGuestCount,
      maxCapacity: MAX_CAPACITY,
      remainingCapacity: MAX_CAPACITY - currentGuestCount,
    };
  }

  return { exceeded: false };
};
