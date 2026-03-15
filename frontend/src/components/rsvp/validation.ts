import { z } from "zod";
import { AttendanceStatus, EventParticipation, GuestType } from "./types";

const childSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "Child's name must be at least 2 characters")
    .max(100, "Child's name must be less than 100 characters"),
  age: z
    .number()
    .min(2, "Child must be at least 2 years old")
    .max(12, "Child must be 12 years old or younger"),
});

// Create a schema specifically for guests who are not attending
export const guestSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    telephone: z
      .string()
      .min(10, "Le numéro de téléphone est requis et doit comporter au moins 10 caractères")
      .max(20, "Le numéro de téléphone doit comporter moins de 20 caractères")
      .refine(
        (val) => /^(\+[0-9]{1,3})?[0-9\s.-]{10,15}$/.test(val),
        { message: "Veuillez entrer un numéro de téléphone valide" }
      ),
    attending: z.nativeEnum(AttendanceStatus, {
      required_error: "Please select your attendance status",
    }),
    // Make these fields optional with conditional validation applied later
    guestType: z
      .nativeEnum(GuestType, {
        required_error: "Please select if you're coming alone or as a couple",
      })
      .optional(),
    eventParticipation: z
      .nativeEnum(EventParticipation, {
        required_error: "Please select which events you'll attend",
      })
      .nullable()
      .optional(),
    partnerFirstName: z
      .string()
      .min(2, "Partner first name must be at least 2 characters")
      .max(50, "Partner first name must be less than 50 characters")
      .optional(),
    partnerLastName: z
      .string()
      .min(2, "Partner last name must be at least 2 characters")
      .max(50, "Partner last name must be less than 50 characters")
      .optional(),
    partnerName: z
      .string()
      .min(2, "Partner name must be at least 2 characters")
      .max(100, "Partner name must be less than 100 characters")
      .optional(),
    partnerEmail: z
      .string()
      .email("Please enter a valid email address for your partner")
      .max(100, "Partner email must be less than 100 characters")
      .optional(),
    partnerTelephone: z
      .string()
      .max(20, "Le numéro de téléphone du partenaire doit comporter moins de 20 caractères")
      .refine(
        (val) => !val || /^(\+[0-9]{1,3})?[0-9\s.-]{10,15}$/.test(val),
        { message: "Veuillez entrer un numéro de téléphone valide pour votre partenaire" }
      )
      .optional(),
    partnerEventParticipation: z.nativeEnum(EventParticipation).optional(),
    hasChildren: z.boolean().default(false),
    childrenCount: z
      .number()
      .min(0, "Number of children cannot be negative")
      .max(10, "Maximum 10 children allowed")
      .default(0),
    children: z.array(childSchema).default([]),
    // dietaryRequirements: z.string()
    //   .max(500, "Dietary requirements must be less than 500 characters")
    //   .optional(),
    // notes: z.string()
    //   .max(1000, "Notes must be less than 1000 characters")
    //   .optional(),
  })
  .superRefine((data, ctx) => {
    // For non-attending guests, ensure eventParticipation is NONE
    if (data.attending === AttendanceStatus.NO) {
      // Validate that eventParticipation is NONE for non-attending guests
      if (data.eventParticipation !== EventParticipation.NONE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-attending guests must have 'None' event participation",
          path: ["eventParticipation"],
        });
      }
      
      // Validate that partnerEventParticipation is NONE for non-attending guests
      if (data.partnerEventParticipation !== undefined && 
          data.partnerEventParticipation !== EventParticipation.NONE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-attending guests must have 'None' event participation",
          path: ["partnerEventParticipation"],
        });
      }
      
      return; // Skip other validations for non-attending guests
    }
    
    // Only apply these validations if the guest is attending
    if (data.attending === AttendanceStatus.YES) {
      // Require guest type for attending guests
      if (!data.guestType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select if you're coming alone or as a couple",
          path: ["guestType"],
        });
      }

      // Require event participation for attending guests
      if (!data.eventParticipation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select which events you'll attend",
          path: ["eventParticipation"],
        });
      }

      // Skip partner field validation completely for single guests
      if (data.guestType === GuestType.SINGLE) {
        // Clear any validation issues with partner fields for single guests
        // by removing any partner-related data - this ensures we don't trigger
        // the string validations for these fields
        data.partnerName = undefined;
        data.partnerEmail = undefined;
        data.partnerEventParticipation = undefined;
      }
      // Only validate partner fields for couples
      else if (data.guestType === GuestType.COUPLE) {
        // For couples, we require partner name information
        // Check if we have either the legacy partnerName field OR both first and last names
        const hasLegacyPartnerName = data.partnerName && data.partnerName.trim().length >= 2;
        const hasFirstName = data.partnerFirstName && data.partnerFirstName.trim().length >= 2;
        const hasLastName = data.partnerLastName && data.partnerLastName.trim().length >= 2;
        
        if (!hasLegacyPartnerName && !hasFirstName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Veuillez entrer le prénom de votre partenaire",
            path: ["partnerFirstName"],
          });
        }
        
        // If using separate fields, require last name too
        if (hasFirstName && !hasLastName && !hasLegacyPartnerName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Veuillez entrer le nom de famille de votre partenaire",
            path: ["partnerLastName"],
          });
        }

        // Only validate partner email if it's provided (it's optional)
        if (data.partnerEmail !== undefined && data.partnerEmail !== "") {
          // Email validation is already handled by the string().email() validator
        }
      }

      // If has children is true, require at least one child
      if (data.hasChildren) {
        // Check if children data is missing
        if (!data.children || data.children.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add at least one child",
            path: ["children"],
          });
        }
        
        // Ensure childrenCount matches the length of the children array
        if (data.childrenCount !== undefined && 
            data.children && 
            data.childrenCount !== data.children.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The number of children doesn't match the children details provided",
            path: ["childrenCount"],
          });
        }
      }
    }
  });

export const rsvpFormSchema = z.object({
  primaryGuest: guestSchema,
  isSubmitting: z.boolean().default(false),
  currentStep: z.number().default(0),
});

export type RsvpFormData = z.infer<typeof rsvpFormSchema>;
