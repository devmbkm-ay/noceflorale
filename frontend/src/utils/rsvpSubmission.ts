import { useMutation } from '@apollo/client';
import { CREATE_RSVP, PrimaryGuestInput } from '@/graphql/rsvp';
import { toast } from 'sonner';

/**
 * Prepares the guest input object for GraphQL mutation
 * ensuring firstName and lastName are used instead of name
 */
export const prepareGuestInput = (formData: any): PrimaryGuestInput => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    telephone: formData.telephone || "",
    attending: formData.attending,
    guestType: formData.guestType,
    eventParticipation: formData.eventParticipation,
    partnerFirstName: formData.partnerName?.split(' ')[0] || '',
    partnerLastName: formData.partnerName?.split(' ')[1] || '',
    partnerEmail: formData.partnerEmail,
    partnerTelephone: formData.partnerTelephone || "",
    partnerEventParticipation: formData.partnerEventParticipation,
    hasChildren: formData.hasChildren || false,
    childrenCount: formData.childrenCount || 0,
    children: formData.children || [],
  };
};

/**
 * Hook to use RSVP submission with proper error handling
 */
export const useRsvpSubmission = () => {
  const [createRsvp, { loading }] = useMutation(CREATE_RSVP, {
    onError: (error) => {
      console.error('GraphQL Error:', error);
      
      if (error.message.includes('name') && error.message.includes('required')) {
        toast.error('Le prénom et le nom sont obligatoires');
      } else {
        toast.error('Erreur lors de l\'envoi du RSVP', {
          description: error.message || 'Veuillez réessayer plus tard.'
        });
      }
    }
  });

  const submitRsvp = async (formData: any) => {
    try {
      const guestInput = prepareGuestInput(formData);
      
      const result = await createRsvp({
        variables: { guest: guestInput },
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      return { success: false, error };
    }
  };

  return { submitRsvp, loading };
};

