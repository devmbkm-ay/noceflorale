import { GraphQLError } from "graphql";
import { RSVP } from "./model.js";
import { normalizeRsvpObject } from "./helpers.js";
import {
  validateObjectId,
  validateEmail,
  createSafeSearchFilter,
} from "../../../utils/inputSanitizer.js";

export const rsvpQueries = {
  // Check if an email already exists in RSVPs
  checkEmailExists: async (_, { email }) => {
    try {
      console.log('[checkEmailExists] Checking email existence for:', email);
      
      // Step 1: Strict input validation to prevent NoSQL injection
      if (!email || typeof email !== 'string' || email.constructor !== String) {
        console.error('[checkEmailExists] Invalid email parameter:', typeof email, email);
        throw new GraphQLError('Invalid email parameter - must be a string', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      
      // Step 2: Additional security check for object injection attempts
      if (typeof email === 'object' || Array.isArray(email)) {
        console.error('[checkEmailExists] Email parameter is object/array:', email);
        throw new GraphQLError('Email parameter cannot be an object or array', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      
      // Step 3: Validate and sanitize email with comprehensive checks
      const sanitizedEmail = validateEmail(email);
      console.log('[checkEmailExists] Sanitized email:', sanitizedEmail);
      
      // Step 4: Final type verification after sanitization
      if (typeof sanitizedEmail !== 'string' || sanitizedEmail.constructor !== String) {
        console.error('[checkEmailExists] Email sanitization failed:', typeof sanitizedEmail, sanitizedEmail);
        throw new GraphQLError('Email sanitization failed - invalid result type', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      
      // Step 5: Create safe query filter with explicit operators only
      // Using parameterized approach to prevent any injection possibility
      const queryFilter = Object.freeze({
        email: String(sanitizedEmail), // Explicit string conversion
        deleted: { $ne: true }
      });
      
      console.log('[checkEmailExists] Query filter:', queryFilter);
      const existingRsvp = await RSVP.findOne(queryFilter);
      
      const result = {
        exists: !!existingRsvp,
        guestName: existingRsvp ? `${existingRsvp.firstName || ''} ${existingRsvp.lastName || ''}`.trim() : null,
        lastModified: existingRsvp ? existingRsvp.updatedAt || existingRsvp.createdAt : null
      };
      
      console.log('[checkEmailExists] Query result:', result);
      return result;
    } catch (error) {
      console.error('[checkEmailExists] Error checking email existence:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to check email existence', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },
  // Get all deleted RSVPs with optional search filter
  getDeletedRsvps: async (_, { search }) => {
    try {
      // Build filter object - only include deleted RSVPs
      const filter = { deleted: true };

      if (search) {
        // Sanitize search input and create safe search filter
        const safeSearchFilter = createSafeSearchFilter(search, [
          'firstName', 
          'lastName', 
          'email',
          'telephone',
          'partnerName',
          'partnerFirstName',
          'partnerLastName',
          'partnerEmail',
          'partnerTelephone'
        ]);
        
        // Merge the search filter with existing filter
        Object.assign(filter, safeSearchFilter);
      }

      // Execute query with filters
      const deletedRsvps = await RSVP.find(filter).sort({ deletedAt: -1 });

      // Ensure all required fields are present before returning
      return deletedRsvps.map(normalizeRsvpObject);
    } catch (error) {
      console.error("Error getting deleted RSVPs:", error);
      throw new GraphQLError("Failed to get deleted RSVPs", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Get a single RSVP by ID
  getRsvp: async (_, { id }) => {
    try {
      // Validate and sanitize the ID to prevent NoSQL injection
      const validatedId = validateObjectId(id);
      const rsvp = await RSVP.findOne({ 
        _id: { $eq: validatedId }, 
        deleted: { $ne: true } 
      });
      if (!rsvp) {
        throw new GraphQLError("RSVP not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return normalizeRsvpObject(rsvp);
    } catch (error) {
      console.error("Error getting RSVP:", error);
      throw new GraphQLError("Failed to get RSVP", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Get all RSVPs with optional filters
  getAllRsvps: async (_, args) => {
    try {
      const { attending, eventParticipation, search } = args;

      // Build filter object
      const filter = { deleted: { $ne: true } };

      if (attending) {
        filter.attending = attending;
      }

      if (eventParticipation) {
        filter.eventParticipation = eventParticipation;
      }

      if (search) {
        // Sanitize search input and create safe search filter
        const safeSearchFilter = createSafeSearchFilter(search, [
          'firstName', 
          'lastName', 
          'email', 
          'partnerName',
          'partnerFirstName',
          'partnerLastName'
        ]);
        
        // Merge the search filter with existing filter
        Object.assign(filter, safeSearchFilter);
      }

      // Execute query with filters
      const rsvps = await RSVP.find(filter).sort({ createdAt: -1 });

      // Ensure all required fields are present before returning
      return rsvps.map(normalizeRsvpObject);
    } catch (error) {
      console.error("Error getting RSVPs:", error);
      throw new GraphQLError("Failed to get RSVPs", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Get RSVP statistics
  getRsvpStats: async () => {
    try {
      // Get all RSVPs (excluding soft-deleted ones)
      const rsvps = await RSVP.find({ deleted: { $ne: true } });

      // Initialize stats
      const stats = {
        totalGuests: 0,
        maxCapacity: 340, // Set max capacity to 340 guests
        attending: 0,
        notAttending: 0,
        ceremonyOnly: 0,
        receptionOnly: 0,
        both: 0,
        totalAdults: 0,
        totalChildren: 0,
      };

      // Calculate stats from RSVPs
      rsvps.forEach((rsvp) => {
        // Count by attendance
        if (rsvp.attending === "attending") {
          stats.attending++;

          // Count total guests (primary guest + partner + children)
          let guestCount = 1; // Primary guest

          // Add partner if couple
          if (rsvp.guestType === "couple") {
            guestCount++;
          }

          // Add children if any
          if (rsvp.hasChildren && rsvp.children && rsvp.children.length > 0) {
            guestCount += rsvp.children.length;
          }

          // Add to total guests count
          stats.totalGuests += guestCount;

          // Count adults (primary guest + partner if couple)
          stats.totalAdults += rsvp.guestType === "couple" ? 2 : 1;

          // Count children
          if (rsvp.hasChildren && rsvp.children && rsvp.children.length > 0) {
            stats.totalChildren += rsvp.children.length;
          }

          // Count by event participation
          if (rsvp.eventParticipation === "both") {
            // For both events, count the exact number of people (1 for single, 2 for couple)
            // This matches the calculation in EventAttendanceBreakdown.tsx
            const bothCount = rsvp.guestType === "couple" ? 2 : 1;
            stats.both += bothCount;
          } else if (rsvp.eventParticipation === "blessing_only") {
            // For consistency, count the same way as 'both'
            stats.ceremonyOnly += rsvp.guestType === "couple" ? 2 : 1;
          } else if (rsvp.eventParticipation === "evening_only") {
            // For consistency, count the same way as 'both'
            stats.receptionOnly += rsvp.guestType === "couple" ? 2 : 1;
          }
        } else {
          stats.notAttending++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting RSVP stats:", error);
      throw new GraphQLError("Failed to get RSVP statistics", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
};
