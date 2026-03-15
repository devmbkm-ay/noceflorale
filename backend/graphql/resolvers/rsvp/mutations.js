import { GraphQLError } from "graphql";
import { RSVP } from "./model.js";
import { validateRsvpData, checkCapacityLimit } from "./helpers.js";
import { sendFeedbackEmail, testEmailConfiguration } from "../../../utils/emailService.js";
import { validateObjectId, validateEmail } from "../../../utils/inputSanitizer.js";

export const rsvpMutations = {
  // Admin only: migrate partner names for all RSVPs
  migratePartnerNames: async (_, __, { isAuthenticated }) => {
    try {
      // Check authentication - uncomment this in production
      // if (!isAuthenticated) {
      //   throw new GraphQLError('Not authenticated', {
      //     extensions: { code: 'UNAUTHENTICATED' },
      //   });
      // }
      
      // Find all RSVPs that have partnerEmail but might be missing partner name fields
      const rsvps = await RSVP.find({
        $or: [
          { partnerName: { $exists: true, $ne: null, $ne: '' } },
          { partnerEmail: { $exists: true, $ne: null, $ne: '' } }
        ],
        guestType: 'couple',
        deleted: { $ne: true }
      });
      
      console.log(`Found ${rsvps.length} RSVPs to process`);
      
      let updatedCount = 0;
      
      for (const rsvp of rsvps) {
        let updated = false;
        const updates = {};
        
        // Process partnerName if it exists and partnerFirstName/partnerLastName don't
        if (rsvp.partnerName && (!rsvp.partnerFirstName && !rsvp.partnerLastName)) {
          const nameParts = rsvp.partnerName.trim().split(' ');
          if (nameParts.length > 0) {
            updates.partnerFirstName = nameParts[0];
            updates.partnerLastName = nameParts.slice(1).join(' ');
            updated = true;
          }
        }
        
        // If partner email exists but no partner name information at all, use the email prefix as first name
        if (rsvp.partnerEmail && !rsvp.partnerFirstName && !rsvp.partnerLastName && !rsvp.partnerName) {
          updates.partnerFirstName = rsvp.partnerEmail.split('@')[0] || 'Partner';
          updates.partnerLastName = '';
          updated = true;
        }
        
        // If we have updates to apply
        if (updated) {
          await RSVP.findByIdAndUpdate(rsvp._id, { $set: updates });
          updatedCount++;
          console.log(`Updated RSVP for ${rsvp.firstName} ${rsvp.lastName} (ID: ${rsvp._id})`);
          console.log(`  Partner name set to: ${updates.partnerFirstName} ${updates.partnerLastName}`);
        }
      }
      
      console.log(`Migration completed. Updated ${updatedCount} out of ${rsvps.length} RSVPs.`);
      return updatedCount;
    } catch (error) {
      console.error('Error during migration:', error);
      throw new GraphQLError('Failed to migrate partner names', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
  },

  // Create a new RSVP
  createRsvp: async (_, { guest }, context) => {
    console.log("[createRsvp] Received guest data:", JSON.stringify(guest, null, 2));
    // Check referer header if provided in context
    if (context.refererInfo && !context.refererInfo.validated) {
      console.warn(`RSVP submission blocked due to invalid referer: ${context.refererInfo.referer || 'none'}`);
      throw new GraphQLError("Invalid request origin", {
        extensions: { 
          code: "INVALID_REFERER",
          status: 403
        }
      });
    }
    try {
      // Validate and sanitize the email to prevent NoSQL injection
      const sanitizedEmail = validateEmail(guest.email);
      console.log("[createRsvp] Sanitized email:", sanitizedEmail);
      
      // Check if an RSVP with this email already exists (and is not soft-deleted)
      // Use explicit $eq operator to prevent NoSQL injection
      const existingRsvp = await RSVP.findOne({ 
        email: { $eq: sanitizedEmail }, 
        deleted: { $ne: true } 
      });
      if (existingRsvp) {
        console.warn("[createRsvp] Existing RSVP found for email:", sanitizedEmail);
        throw new GraphQLError("An RSVP with this email already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Check guest capacity limit only for attending guests
      if (guest.attending === "attending") {
        const capacityCheck = await checkCapacityLimit(RSVP, guest);
        if (capacityCheck.exceeded) {
          console.warn(`[createRsvp] Capacity exceeded: ${capacityCheck.currentCount}/${capacityCheck.maxCapacity}`);
          throw new GraphQLError(
            `Sorry, we have reached our maximum guest capacity of ${capacityCheck.maxCapacity}. Currently ${capacityCheck.currentCount} guests confirmed.`,
            {
              extensions: {
                code: "CAPACITY_EXCEEDED",
                currentCount: capacityCheck.currentCount,
                maxCapacity: capacityCheck.maxCapacity,
                remainingCapacity: capacityCheck.remainingCapacity,
              },
            }
          );
        }
      }

      // Validate and normalize the RSVP data to ensure business rules are followed
      const validatedGuestData = validateRsvpData(guest);
      console.log("[createRsvp] Validated guest data:", JSON.stringify(validatedGuestData, null, 2));

      // Create new RSVP with validated data
      const rsvpData = {
        ...validatedGuestData,
        createdAt: new Date(),
      };
      console.log("[createRsvp] RSVP data before saving:", JSON.stringify(rsvpData, null, 2));

      // For non-attending guests, ensure required fields have default values
      if (guest.attending === "not_attending") {
        // Set default values for required fields if not attending
        if (!guest.guestType) rsvpData.guestType = "single";
        // eventParticipation is already set to 'none' by the validateRsvpData function
      }

      // Create and save the RSVP
      const newRsvp = new RSVP(rsvpData);
      
      // Save with explicit error handling
      try {
        const savedRsvp = await newRsvp.save();
        console.log("[createRsvp] Successfully created RSVP:", JSON.stringify(savedRsvp, null, 2));
        
        // Verify the RSVP was actually saved by querying it back
        const verifyRsvp = await RSVP.findOne({ 
          email: { $eq: sanitizedEmail }, 
          deleted: { $ne: true } 
        });
        
        if (!verifyRsvp) {
          console.error("[createRsvp] CRITICAL: RSVP not found after save operation");
          throw new GraphQLError("RSVP creation verification failed", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        
        console.log("[createRsvp] RSVP creation verified successfully");
        return savedRsvp;
      } catch (saveError) {
        console.error("[createRsvp] Error during RSVP save operation:", saveError);
        
        // Check if it's a validation error
        if (saveError.name === 'ValidationError') {
          const validationMessages = Object.values(saveError.errors).map(err => err.message);
          throw new GraphQLError(`Validation failed: ${validationMessages.join(', ')}`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        // Check if it's a duplicate key error
        if (saveError.code === 11000) {
          throw new GraphQLError("An RSVP with this email already exists", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        
        throw saveError;
      }
    } catch (error) {
      console.error("[createRsvp] Error details:", error);
      console.error("[createRsvp] Error creating RSVP:", error);
      console.error("[createRsvp] Submitted data:", guest);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError("Failed to create RSVP", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Update an existing RSVP
  updateRsvp: async (_, { id, guest }, context) => {
    console.log(`[updateRsvp] Received ID: ${id}, Guest Data: ${JSON.stringify(guest, null, 2)}`);
    // Check referer header if provided in context
    if (context.refererInfo && !context.refererInfo.validated) {
      console.warn(`RSVP update blocked due to invalid referer: ${context.refererInfo.referer || 'none'}`);
      throw new GraphQLError("Invalid request origin", {
        extensions: { 
          code: "INVALID_REFERER",
          status: 403
        }
      });
    }
    try {
      // Validate and sanitize the ID to prevent NoSQL injection
      const validatedId = validateObjectId(id);
      console.log(`[updateRsvp] Validated ID: ${validatedId}`);
      
      // Find the RSVP
      const rsvp = await RSVP.findById(validatedId);
      if (!rsvp) {
        console.error(`[updateRsvp] RSVP not found for ID: ${validatedId}`);
        throw new GraphQLError("RSVP not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      console.log(`[updateRsvp] Found existing RSVP: ${JSON.stringify(rsvp, null, 2)}`);

      // Check for capacity limit when updating attendance status from not attending to attending
      if (rsvp.attending === "not_attending" && guest.attending === "attending") {
        const capacityCheck = await checkCapacityLimit(RSVP, guest, rsvp);
        if (capacityCheck.exceeded) {
          console.warn(`[updateRsvp] Capacity exceeded: ${capacityCheck.currentCount}/${capacityCheck.maxCapacity}`);
          throw new GraphQLError(
            `Sorry, we have reached our maximum guest capacity of ${capacityCheck.maxCapacity}. Currently ${capacityCheck.currentCount} guests confirmed.`,
            {
              extensions: {
                code: "CAPACITY_EXCEEDED",
                currentCount: capacityCheck.currentCount,
                maxCapacity: capacityCheck.maxCapacity,
                remainingCapacity: capacityCheck.remainingCapacity,
              },
            }
          );
        }
      }

      // Validate and normalize the RSVP data to ensure business rules are followed
      const validatedGuestData = validateRsvpData(guest);
      console.log(`[updateRsvp] Validated Guest Data: ${JSON.stringify(validatedGuestData, null, 2)}`);

      // Update the RSVP with validated data
      const updatedRsvp = await RSVP.findByIdAndUpdate(
        id,
        {
          ...validatedGuestData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );
      console.log(`[updateRsvp] Result of findByIdAndUpdate: ${JSON.stringify(updatedRsvp, null, 2)}`);

      return updatedRsvp;
    } catch (error) {
      console.error("[updateRsvp] Error updating RSVP:", error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError("Failed to update RSVP", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Soft delete an RSVP
  deleteRsvp: async (_, { id }) => {
    console.log(`[deleteRsvp] Starting deletion process for ID: ${id}`);
    try {
      // Validate and sanitize the ID to prevent NoSQL injection
      console.log(`[deleteRsvp] Validating ID: ${id}`);
      const validatedId = validateObjectId(id);
      console.log(`[deleteRsvp] Validated ID: ${validatedId}`);
      
      // Find the RSVP with explicit operators to prevent NoSQL injection
      console.log(`[deleteRsvp] Searching for RSVP with ID: ${validatedId}`);
      const rsvp = await RSVP.findOne({ 
        _id: { $eq: validatedId }, 
        deleted: { $ne: true } 
      });
      
      if (!rsvp) {
        console.error(`[deleteRsvp] RSVP not found or already deleted for ID: ${validatedId}`);
        
        // Check if RSVP exists but is already deleted
        const deletedRsvp = await RSVP.findOne({ _id: { $eq: validatedId } });
        if (deletedRsvp) {
          console.log(`[deleteRsvp] RSVP exists but is already deleted: ${JSON.stringify(deletedRsvp, null, 2)}`);
          throw new GraphQLError("RSVP is already deleted", {
            extensions: { code: "ALREADY_DELETED" },
          });
        }
        
        throw new GraphQLError("RSVP not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      console.log(`[deleteRsvp] Found RSVP: ${rsvp.firstName} ${rsvp.lastName} (${rsvp.email})`);

      // Soft delete the RSVP
      console.log(`[deleteRsvp] Performing soft delete for ID: ${validatedId}`);
      const deletedAt = new Date();
      
      // Modify email to avoid unique constraint issues (similar to pre-save middleware)
      const modifiedEmail = `${rsvp.email}_deleted_${deletedAt.getTime()}`;
      console.log(`[deleteRsvp] Modifying email from '${rsvp.email}' to '${modifiedEmail}'`);
      
      const updateResult = await RSVP.findByIdAndUpdate(validatedId, {
        email: modifiedEmail,
        deleted: true,
        deletedAt: deletedAt
      });
      
      if (!updateResult) {
        console.error(`[deleteRsvp] Update operation failed for ID: ${validatedId}`);
        throw new GraphQLError("Failed to update RSVP deletion status", {
          extensions: { code: "UPDATE_FAILED" },
        });
      }
      
      console.log(`[deleteRsvp] Successfully soft-deleted RSVP: ${validatedId}`);
      return true;
    } catch (error) {
      console.error(`[deleteRsvp] Error details:`, {
        message: error.message,
        stack: error.stack,
        id: id,
        type: error.constructor.name
      });
      
      // If it's already a GraphQLError, re-throw it
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // For other errors, provide more context
      throw new GraphQLError(`Failed to delete RSVP: ${error.message}`, {
        extensions: { 
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message
        },
      });
    }
  },

  // Restore a soft-deleted RSVP
  restoreRsvp: async (_, { id }) => {
    console.log(`[restoreRsvp] Starting restoration process for ID: ${id}`);
    try {
      // Validate and sanitize the ID to prevent NoSQL injection
      const validatedId = validateObjectId(id);
      console.log(`[restoreRsvp] Validated ID: ${validatedId}`);
      
      // Find the RSVP (including soft-deleted ones) with explicit operators
      const rsvp = await RSVP.findOne({ 
        _id: { $eq: validatedId }, 
        deleted: { $eq: true } 
      });
      if (!rsvp) {
        console.error(`[restoreRsvp] Deleted RSVP not found for ID: ${validatedId}`);
        throw new GraphQLError("Deleted RSVP not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      console.log(`[restoreRsvp] Found deleted RSVP: ${rsvp.firstName} ${rsvp.lastName} (${rsvp.email})`);

      // Restore the original email by removing the _deleted_timestamp suffix
      let originalEmail = rsvp.email;
      if (originalEmail.includes('_deleted_')) {
        originalEmail = originalEmail.split('_deleted_')[0];
        console.log(`[restoreRsvp] Restoring email from '${rsvp.email}' to '${originalEmail}'`);
      }

      // Restore the RSVP
      const updateResult = await RSVP.findByIdAndUpdate(validatedId, {
        email: originalEmail,
        deleted: false,
        deletedAt: null,
        updatedAt: new Date()
      });
      
      if (!updateResult) {
        console.error(`[restoreRsvp] Update operation failed for ID: ${validatedId}`);
        throw new GraphQLError("Failed to update RSVP restoration status", {
          extensions: { code: "UPDATE_FAILED" },
        });
      }
      
      console.log(`[restoreRsvp] Successfully restored RSVP: ${validatedId}`);
      return true;
    } catch (error) {
      console.error(`[restoreRsvp] Error details:`, {
        message: error.message,
        stack: error.stack,
        id: id,
        type: error.constructor.name
      });
      
      // If it's already a GraphQLError, re-throw it
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      throw new GraphQLError(`Failed to restore RSVP: ${error.message}`, {
        extensions: { 
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message
        },
      });
    }
  },

  // Send feedback email to a guest
  sendFeedbackToGuest: async (_, { input }) => {
    try {
      const { guestId, subject, message, fromName } = input;

      // Validate and sanitize the guest ID to prevent NoSQL injection
      const validatedGuestId = validateObjectId(guestId);
      
      // Find the guest with explicit operators to prevent NoSQL injection
      const guest = await RSVP.findOne({ 
        _id: { $eq: validatedGuestId }, 
        deleted: { $ne: true } 
      });
      if (!guest) {
        throw new GraphQLError("Guest not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if guest is attending (optional restriction)
      if (guest.attending !== 'attending') {
        console.warn(`Attempting to send feedback to non-attending guest: ${guest.email}`);
        // You can uncomment the next lines if you want to restrict feedback to attending guests only
        // throw new GraphQLError("Feedback can only be sent to attending guests", {
        //   extensions: { code: "BAD_USER_INPUT" },
        // });
      }

      // Send the feedback email
      const result = await sendFeedbackEmail({
        guestEmail: guest.email,
        guestName: `${guest.firstName} ${guest.lastName}`,
        subject,
        message,
        fromName: fromName || 'Équipe Noce Florale'
      });

      return {
        success: result.success,
        messageId: result.messageId,
        recipient: guest.email,
        error: null
      };
    } catch (error) {
      console.error("Error sending feedback email:", error);
      
      return {
        success: false,
        messageId: null,
        recipient: "",
        error: error.message
      };
    }
  },

  // Test email configuration
  testEmailConfiguration: async () => {
    try {
      const result = await testEmailConfiguration();
      
      return {
        success: result.success,
        messageId: null,
        recipient: "test@example.com",
        error: result.success ? null : result.error
      };
    } catch (error) {
      console.error("Error testing email configuration:", error);
      
      return {
        success: false,
        messageId: null,
        recipient: "test@example.com",
        error: error.message
      };
    }
  },
};
