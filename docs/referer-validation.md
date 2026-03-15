# Referer Header Validation Implementation

## Overview

This document explains how the Referer header validation has been implemented for the RSVP functionality in the Noce Florale wedding website. The implementation provides protection against Cross-Site Request Forgery (CSRF) attacks and unauthorized form submissions from external sites.

## Implementation Details

### 1. Backend Middleware

A middleware has been added to the Apollo Server setup in `backend/server.js` that:

- Extracts the Referer header from incoming requests
- Validates the Referer against the allowed domains defined in the CORS configuration
- For RSVP-related mutations, enforces validation rules
- Passes referer information to the GraphQL context for use in resolvers

```javascript
// Referer header validation middleware
(req, res, next) => {
  // Get the referer header
  const referer = req.headers.referer || req.headers.referrer;
  
  // Allow GraphQL playground and direct API access for development
  if (process.env.NODE_ENV === 'development') {
    req.refererInfo = { 
      referer,
      validated: true,
      source: 'development_bypass'
    };
    return next();
  }
  
  // Check if it's a mutation related to RSVP submissions
  const isRsvpMutation = req.body && 
    req.body.query && 
    (req.body.query.includes('createRsvp') || req.body.query.includes('updateRsvp'));
  
  // Only validate referer for RSVP mutations
  if (isRsvpMutation) {
    // List of allowed referer domains
    const allowedDomains = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin];
    
    // Check if referer is valid
    const isValidReferer = referer && allowedDomains.some(domain => {
      // Convert wildcard domains to regex patterns
      if (domain === '*') return true;
      
      const domainPattern = domain.replace(/\*/g, '.*');
      return new RegExp(`^${domainPattern}`).test(referer);
    });
    
    // Store referer info in request object for later access in resolvers
    req.refererInfo = {
      referer,
      validated: isValidReferer,
      source: isValidReferer ? 'valid_domain' : 'invalid_domain'
    };
    
    if (!isValidReferer) {
      console.warn(`Invalid referer for RSVP mutation: ${referer || 'none'}`);
    }
  } else {
    // For non-RSVP operations, just log the referer but don't validate
    req.refererInfo = {
      referer,
      validated: true,
      source: 'non_rsvp_operation'
    };
  }
  
  next();
}
```

### 2. Resolver Validation

Both the `createRsvp` and `updateRsvp` resolvers in `backend/graphql/resolvers/rsvp.js` check the referer validation status:

```javascript
// Create a new RSVP
createRsvp: async (_, { guest }, context) => {
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
  
  // Rest of resolver implementation...
}
```

### 3. Frontend Error Handling

The frontend RSVP form (`frontend/src/components/rsvp/RsvpForm.tsx`) has been updated to handle referer validation errors:

```javascript
// Check for referer validation error
const refererError = error.graphQLErrors.find(
  (err) => 
    err.message.includes("Invalid request origin") ||
    (err.extensions?.code === "INVALID_REFERER")
);

// Handle referer validation error
if (refererError) {
  toast.error("Erreur de sécurité", {
    description: "Pour des raisons de sécurité, les soumissions ne sont acceptées que depuis notre site officiel. Veuillez réessayer en utilisant le formulaire sur notre site.",
  });
  console.error("Referer validation error:", refererError);
  return;
}
```

## How It Works

1. When a user submits an RSVP form, the browser automatically includes the Referer header in the request
2. The middleware captures this header and validates it against allowed domains
3. If the referer is valid (from an allowed domain), the request proceeds normally
4. If the referer is invalid or missing, the middleware marks it as invalid
5. The resolver checks this validation status and rejects invalid requests
6. The frontend shows a friendly error message to the user

## Security Benefits

- **Protection Against CSRF Attacks**: Prevents malicious websites from submitting forms on behalf of users
- **Form Embedding Protection**: Blocks submissions from forms embedded on unauthorized domains
- **Audit Trail**: Logs all submission attempts with referer information for security monitoring

## Configuration

The allowed domains are configured through the CORS settings in `backend/config/index.js`. To add additional allowed domains, update the `cors.origin` array in this file.

## Testing

To test the referer validation:

1. **Valid Submission**: Access the form from the official website domain
2. **Invalid Submission**: Try submitting directly to the GraphQL endpoint from a different domain
3. **Development Testing**: In development mode, validation is bypassed for easier testing

## Troubleshooting

If legitimate submissions are being blocked:

1. Check the server logs for "Invalid referer for RSVP mutation" messages
2. Verify that the domain making the request is included in the CORS configuration
3. Ensure the browser is sending the Referer header (some privacy configurations may block it)
