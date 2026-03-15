import { ApolloClient } from '@apollo/client';
import { CHECK_EMAIL_EXISTS } from '@/graphql/rsvp';

export interface VerificationResult {
  verified: boolean;
  exists: boolean;
  guestName?: string;
  error?: string;
}

export const verifyRsvpInDatabase = async (
  client: ApolloClient<any>,
  email: string,
  maxRetries = 3,
  retryDelay = 1000
): Promise<VerificationResult> => {
  console.log(`🔍 Starting RSVP verification for email: ${email}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Verification attempt ${attempt}/${maxRetries}`);
      
      // Add progressive delay between attempts
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
      
      const result = await client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email },
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      });
      
      console.log(`🔍 Verification result (attempt ${attempt}):`, result);
      
      if (result.data?.checkEmailExists) {
        const { exists, guestName } = result.data.checkEmailExists;
        
        if (exists) {
          console.log(`✅ RSVP verified successfully in database (attempt ${attempt})`);
          return {
            verified: true,
            exists: true,
            guestName: guestName || undefined
          };
        } else {
          console.log(`❌ RSVP not found in database (attempt ${attempt})`);
          
          // On last attempt, return failure
          if (attempt === maxRetries) {
            return {
              verified: false,
              exists: false,
              error: `RSVP not found after ${maxRetries} verification attempts`
            };
          }
          
          // Continue to next attempt
          continue;
        }
      } else {
        console.error(`❌ Invalid verification response (attempt ${attempt}):`, result);
        
        if (attempt === maxRetries) {
          return {
            verified: false,
            exists: false,
            error: 'Invalid verification response from server'
          };
        }
        
        continue;
      }
    } catch (error) {
      console.error(`❌ Verification error (attempt ${attempt}):`, error);
      
      if (attempt === maxRetries) {
        return {
          verified: false,
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown verification error'
        };
      }
      
      // Continue to next attempt on error
      continue;
    }
  }
  
  // This should never be reached, but just in case
  return {
    verified: false,
    exists: false,
    error: 'Verification failed after all attempts'
  };
};

export const handleVerificationResult = (
  result: VerificationResult,
  guestName: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  if (result.verified && result.exists) {
    console.log('✅ RSVP verification successful');
    onSuccess();
  } else {
    console.error('❌ RSVP verification failed:', result.error);
    const errorMessage = result.error || 'Verification failed - guest not found in database';
    onError(errorMessage);
  }
};
