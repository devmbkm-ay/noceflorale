# Phone Number Requirement Implementation

## Summary
This document outlines the changes made to require guest phone numbers in the wedding management system.

## Changes Made

### 1. Backend Changes

#### Database Schema (backend/graphql/resolvers/rsvp.js)
- **Line 89**: Updated mongoose schema to make `telephone` field required:
  ```javascript
  // Before:
  telephone: { type: String },
  
  // After:
  telephone: { type: String, required: true },
  ```

#### GraphQL Schema (backend/graphql/schema/rsvp.js)
- **Line 39**: Made `telephone` field required in `PrimaryGuest` type:
  ```graphql
  # Before:
  telephone: String
  
  # After:
  telephone: String!
  ```

- **Line 63**: Made `telephone` field required in `PrimaryGuestInput` type:
  ```graphql
  # Before:
  telephone: String
  
  # After:
  telephone: String!
  ```

### 2. Frontend Changes

#### Validation Schema (frontend/src/components/rsvp/validation.ts)
- **Lines 31-38**: Updated Zod validation to make telephone required:
  ```typescript
  // Before:
  telephone: z
    .string()
    .max(20, "Le numéro de téléphone doit comporter moins de 20 caractères")
    .refine(
      (val) => !val || /^(\+[0-9]{1,3})?[0-9\s.-]{7,15}$/.test(val),
      { message: "Veuillez entrer un numéro de téléphone valide" }
    )
    .optional(),

  // After:
  telephone: z
    .string()
    .min(7, "Le numéro de téléphone est requis et doit comporter au moins 7 caractères")
    .max(20, "Le numéro de téléphone doit comporter moins de 20 caractères")
    .refine(
      (val) => /^(\+[0-9]{1,3})?[0-9\s.-]{7,15}$/.test(val),
      { message: "Veuillez entrer un numéro de téléphone valide" }
    ),
  ```

#### TypeScript Types (frontend/src/components/rsvp/types.ts)
- **Line 29**: Updated interface to make telephone required:
  ```typescript
  // Before:
  telephone?: string;
  
  // After:
  telephone: string;
  ```

#### Old RSVP Component (frontend/src/components/old_rsvp/GuestInformation.tsx)
- **Line 120**: Updated label to show phone number is required
- **Line 126**: Added `required` attribute to input field
- **Lines 128-132**: Added proper error display for phone validation

## Validation Rules

The phone number field now enforces the following rules:

1. **Required**: Cannot be empty or undefined
2. **Minimum Length**: Must be at least 7 characters
3. **Maximum Length**: Must be less than 20 characters
4. **Format**: Must match the regex pattern `^(\+[0-9]{1,3})?[0-9\s.-]{7,15}$`
   - Allows optional country code (e.g., +33, +1)
   - Allows numbers, spaces, dots, and hyphens
   - Must be between 7-15 digits (excluding country code)

## Examples of Valid Phone Numbers

- `+33 1 23 45 67 89` (French format with country code)
- `01 23 45 67 89` (French format without country code)
- `+1 555-123-4567` (US format)
- `555.123.4567` (US format with dots)
- `5551234567` (Simple numeric format)

## Error Messages

- **French**: "Le numéro de téléphone est requis et doit comporter au moins 7 caractères"
- **Validation**: "Veuillez entrer un numéro de téléphone valide"

## Testing

After implementing these changes:

1. **Backend**: The GraphQL schema enforces phone number requirement
2. **Frontend**: Form validation prevents submission without a valid phone number
3. **Database**: Mongoose schema validates phone number presence on save

## Backward Compatibility

⚠️ **Important**: These changes will affect existing data:

- Existing RSVP records without phone numbers may need to be updated
- Any existing frontend forms will now require phone numbers
- API calls without phone numbers will be rejected

## Recommendations

1. **Data Migration**: Consider running a script to populate missing phone numbers for existing RSVPs
2. **User Communication**: Inform users that phone numbers are now required
3. **Admin Interface**: Update admin interfaces to reflect the new requirement
4. **Testing**: Test the RSVP flow end-to-end to ensure proper validation

## Next Steps

1. Test the RSVP form to ensure phone number validation works
2. Update any admin interfaces that create/edit guests
3. Consider adding phone number to any existing guest records
4. Update user-facing documentation about the requirement
