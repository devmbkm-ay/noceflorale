import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useForm,
  FormProvider,
  FieldPath,
  useFormContext as useReactHookFormContext,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import {
  isDuplicateEmailError,
  handleDuplicateEmailError,
} from "@/utils/rsvpErrorHandling";
import { verifyRsvpInDatabase, handleVerificationResult } from "@/utils/rsvpVerification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { rsvpFormSchema, type RsvpFormData } from "./validation";
import { AttendanceStatus, EventParticipation, GuestType } from "./types";
import { CREATE_RSVP, PrimaryGuestInput, CHECK_EMAIL_EXISTS } from "@/graphql/rsvp";
import { useMutation, useLazyQuery, ApolloError } from "@apollo/client";
import AttendanceStep from "./steps/AttendanceStep";
import GuestTypeStep from "./steps/GuestTypeStep";
import EventParticipationStep from "./steps/EventParticipationStep";
import PartnerInfoStep from "./steps/PartnerInfoStep";
// import ChildrenInfoStep from "./steps/ChildrenInfoStep"; // Children section muted
import ReviewStep from "./steps/ReviewStep";
// import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import Image from "next/image";
import { Check, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { CheckCircle } from "lucide-react";

// Capacity Indicator component to show current RSVP capacity status
const CapacityIndicator: React.FC = () => {
  const [stats, setStats] = useState<{
    totalGuests: number;
    maxCapacity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🌍 Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      currentUrl: typeof window !== "undefined" ? window.location.href : "SSR",
    });
    // Fetch capacity stats from the server
    const fetchCapacityStats = async () => {
      try {
        setLoading(true);
        // Use the same API URL as your Apollo client
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

        console.log("🔗 Using API URL:", apiUrl); // Add this for debugging

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add CORS headers if needed
            "apollo-require-preflight": "true",
          },
          body: JSON.stringify({
            query: `
              query GetRsvpStats {
                getRsvpStats {
                  totalGuests
                  maxCapacity
                  attending
                  notAttending
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          console.error(
            "❌ Fetch response not ok:",
            response.status,
            response.statusText
          );
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("📊 Capacity stats result:", result); // Add this for debugging

        if (result.errors) {
          console.error("❌ GraphQL errors in capacity stats:", result.errors);
          throw new Error(result.errors[0]?.message || "GraphQL error");
        }

        const data = result.data?.getRsvpStats;

        if (!data) {
          throw new Error("Invalid response format");
        }

        setStats({
          totalGuests: data.totalGuests || 0,
          maxCapacity: data.maxCapacity || 340,
        });
      } catch (err) {
        console.error("❌ Error fetching capacity stats:", err);
        setError("Could not load capacity information");
      } finally {
        setLoading(false);
      }
    };

    fetchCapacityStats();
  }, []);

  if (loading || !stats || error) return null; // Don't show anything while loading or on error

  // Only show warning when capacity is at 90% or higher
  if (stats.totalGuests / stats.maxCapacity < 0.9) return null;

  return (
    <div className='mt-2 text-sm font-medium'>
      {stats.totalGuests / stats.maxCapacity > 0.95 ? (
        <span className='text-red-600'>
          Attention : Plus que {stats.maxCapacity - stats.totalGuests} places
          disponibles !
        </span>
      ) : (
        <span className='text-amber-600'>
          Attention :{" "}
          {Math.round((stats.totalGuests / stats.maxCapacity) * 100)}% des
          places sont déjà réservées
        </span>
      )}
    </div>
  );
};

// Helper function to use the form context with proper typing
function useFormContext() {
  return useReactHookFormContext<RsvpFormData>();
}

// Component to display a simplified review for non-attending guests
const NotAttendingReviewStep: React.FC = () => {
  const { watch } = useFormContext();
  const firstName = watch("primaryGuest.firstName");
  const lastName = watch("primaryGuest.lastName");
  const email = watch("primaryGuest.email");

  return (
    <div className='space-y-6'>
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='bg-amber-100 p-3 rounded-full'>
            <CheckCircle className='h-8 w-8 text-amber-600' />
          </div>
        </div>
        <h3 className='text-xl font-medium text-gray-800 mb-2'>
          Merci pour votre réponse
        </h3>
        <p className='text-gray-600 mb-4'>
          Nous sommes désolés mais nous apprécions que vous nous le fassiez
          savoir.
        </p>
        <div className='bg-white rounded-lg p-4 shadow-sm max-w-md mx-auto'>
          <h4 className='font-medium text-gray-700 mb-2 border-b pb-2'>
            Vos Informations
          </h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Nom:</span>
              <span className='font-medium'>
                {firstName} {lastName}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium'>{email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Présence:</span>
              <span className='font-medium text-red-500'>
                Ne sera pas présent(e)
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className='text-center text-sm text-gray-500 italic'>
        Veuillez vérifier vos informations avant d&apos;envoyer votre réponse.
      </p>
    </div>
  );
};

// Export the component directly in its declaration
export default function RsvpForm({ className }: { className?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [attendanceErrorShown, setAttendanceErrorShown] = useState(false);

  // Helper function to validate and prepare guest input data
  const validateAndPrepareGuestInput = (
    data: RsvpFormData
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
  // Setup GraphQL mutation
  const [createRsvp, { loading, client: apolloClient }] = useMutation(CREATE_RSVP, {
    onError: (error) => {
      console.error("GraphQL Error:", error);

      // Check for specific error related to event participation for non-attending guests
      if (
        error.message.includes(
          "Event participation cannot be set for non-attending guests"
        )
      ) {
        toast.error("Erreur de validation", {
          description:
            "Les invités absents ne peuvent pas être assignés à des événements.",
        });
        setAttendanceErrorShown(true);
      } else {
        toast.error("Échec de l'envoi du RSVP", {
          description: error.message || "Veuillez réessayer plus tard.",
        });
      }
    },
  });

  // Setup lazy query for post-submission verification
  const [checkEmailExists] = useLazyQuery(CHECK_EMAIL_EXISTS, {
    fetchPolicy: "network-only"
  });

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      primaryGuest: {
        firstName: "",
        lastName: "",
        email: "",
        telephone: "", // Initialize telephone field
        attending: AttendanceStatus.YES,
        guestType: GuestType.SINGLE,
        // Set eventParticipation to NONE if not attending, otherwise BOTH
        eventParticipation: AttendanceStatus.YES
          ? EventParticipation.BOTH
          : EventParticipation.NONE,
        partnerFirstName: undefined, // Use undefined instead of empty string to avoid validation
        partnerLastName: undefined, // Use undefined instead of empty string to avoid validation
        partnerName: undefined, // Use undefined instead of empty string to avoid validation
        partnerEmail: undefined, // Use undefined instead of empty string to avoid validation
        partnerTelephone: undefined, // Initialize partner telephone field
        // Set partnerEventParticipation to NONE if not attending, otherwise BOTH
        partnerEventParticipation: AttendanceStatus.YES
          ? EventParticipation.BOTH
          : EventParticipation.NONE,
        hasChildren: false, // Always false - children section muted
        children: [], // Always empty - children section muted
        childrenCount: 0, // Always zero - children section muted
      },
      isSubmitting: false,
      currentStep: 0,
    },
    mode: "onChange",
    // Add this to help with debugging
    criteriaMode: "all",
  });

  // Update the form's currentStep value when the state changes
  useEffect(() => {
    form.setValue("currentStep", currentStep);
  }, [currentStep, form]);

  // Watch attendance status changes and reset event participation when status changes to not_attending
  const attendingStatus = form.watch("primaryGuest.attending");

  useEffect(() => {
    // When attendance status changes to not_attending, reset event participation fields
    if (attendingStatus === AttendanceStatus.NO) {
      // Reset event participation fields to NONE for non-attending guests
      form.setValue("primaryGuest.eventParticipation", EventParticipation.NONE);
      form.setValue(
        "primaryGuest.partnerEventParticipation",
        EventParticipation.NONE
      );

      // Reset attendance error flag
      setAttendanceErrorShown(false);

      console.log(
        "Attendance status changed to not attending - cleared event participation"
      );
    }
  }, [attendingStatus, form]);

  const resetForm = () => {
    form.reset();
    setFormSubmitted(false);
    setCurrentStep(0);
    setSubmitting(false);
    form.setValue("isSubmitting", false);
  };

  const nextStep = async () => {
    // Get the current steps based on the form state
    const currentSteps = getFormSteps();
    const TOTAL_STEPS = currentSteps.length;

    // Validate current step fields before proceeding
    const isValid = await form.trigger(getFieldsToValidateForStep(currentStep));

    if (isValid) {
      // If on the first step and not attending, skip directly to the final review step
      if (
        currentStep === 0 &&
        form.getValues().primaryGuest.attending === AttendanceStatus.NO
      ) {
        // For non-attending guests, go directly to the review step (last step)
        const finalStepIndex = TOTAL_STEPS - 1;

        // Set eventParticipation and partnerEventParticipation to NONE for non-attending guests
        form.setValue(
          "primaryGuest.eventParticipation",
          EventParticipation.NONE
        );
        form.setValue(
          "primaryGuest.partnerEventParticipation",
          EventParticipation.NONE
        );

        setCurrentStep(finalStepIndex);
        setMaxVisitedStep((prev) => Math.max(prev, finalStepIndex));
      }
      // For attending single guests, skip partner info step
      else if (
        currentStep === 2 && // Guest Type step
        form.getValues().primaryGuest.guestType === GuestType.SINGLE
      ) {
        // Skip directly to Review step (since Children step is removed)
        const reviewStepIndex = currentSteps.findIndex(
          (step) => step.title === "Review"
        );

        if (reviewStepIndex !== -1) {
          setCurrentStep(reviewStepIndex);
          setMaxVisitedStep((prev) => Math.max(prev, reviewStepIndex));
        } else {
          // Fallback: just go to the next step
          const nextStepIndex = Math.min(currentStep + 1, TOTAL_STEPS - 1);
          setCurrentStep(nextStepIndex);
          setMaxVisitedStep((prev) => Math.max(prev, nextStepIndex));
        }
      } else {
        // Normal progression
        const nextStepIndex = Math.min(currentStep + 1, TOTAL_STEPS - 1);
        setCurrentStep(nextStepIndex);
        setMaxVisitedStep((prev) => Math.max(prev, nextStepIndex));
      }
    } else {
      // If validation fails, show a toast notification
      toast.error(
        "Veuillez remplir correctement tous les champs obligatoires avant de continuer."
      );

      // Get all errors from the form
      const errors = form.formState.errors;
      console.log("Form validation errors:", errors);

      // Optionally, you could highlight specific errors based on the current step
      const currentStepFields = getFieldsToValidateForStep(currentStep);
      const currentStepErrors = currentStepFields.filter((field) => {
        // Check if this field has an error
        const fieldParts = field.split(".");
        let currentObj = errors as Record<string, unknown>;

        for (const part of fieldParts) {
          if (!currentObj || !currentObj[part]) return false;
          currentObj = currentObj[part] as Record<string, unknown>;
        }

        return true;
      });
      if (currentStepErrors.length > 0) {
        console.log("Current step validation errors:", currentStepErrors);
      }
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Navigate to a specific step (for clickable step indicators)
  const goToStep = (stepIndex: number) => {
    // Only allow navigation to visited steps or the next immediate step
    if (stepIndex <= maxVisitedStep || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
      setMaxVisitedStep((prev) => Math.max(prev, stepIndex));
    }
  };

  // Get fields that need validation for the current step based on the flow
  const getFieldsToValidateForStep = (
    step: number
  ): FieldPath<RsvpFormData>[] => {
    const attending = form.watch("primaryGuest.attending");
    const guestType = form.watch("primaryGuest.guestType");
    // const hasChildren = form.watch("primaryGuest.hasChildren");
    const currentSteps = getFormSteps() || [];

    // For the final review step, validate the entire form
    if (step === currentSteps.length - 1) {
      return []; // Empty array means no specific validation for review step
    }

    // For non-attending guests
    if (attending === AttendanceStatus.NO) {
      if (step === 0) {
        // Attendance step
        return [
          "primaryGuest.firstName",
          "primaryGuest.lastName",
          "primaryGuest.email",
          "primaryGuest.telephone",
          "primaryGuest.attending",
        ] as FieldPath<RsvpFormData>[];
      } else {
        // Review step
        return [];
      }
    }

    // For single guests and couples
    const stepTitle = currentSteps[step]?.title || "";

    switch (stepTitle) {
      case "Attendance":
        return [
          "primaryGuest.firstName",
          "primaryGuest.lastName",
          "primaryGuest.email",
          "primaryGuest.telephone",
          "primaryGuest.attending",
        ] as FieldPath<RsvpFormData>[];

      case "Event Participation":
        return ["primaryGuest.eventParticipation"] as FieldPath<RsvpFormData>[];

      case "Guest Type":
        return ["primaryGuest.guestType"] as FieldPath<RsvpFormData>[];

      case "Partner Info":
        return guestType === GuestType.COUPLE
          ? ([
              "primaryGuest.partnerFirstName",
              "primaryGuest.partnerLastName",
              "primaryGuest.partnerEmail",
              "primaryGuest.partnerEventParticipation",
            ] as FieldPath<RsvpFormData>[])
          : [];

      // Children Info step removed
      // case "Children Info":
      //   return hasChildren
      //     ? ([
      //         "primaryGuest.childrenCount",
      //         "primaryGuest.children",
      //       ] as FieldPath<RsvpFormData>[])
      //     : [];

      case "Review":
        return [];

      default:
        return [];
    }
  };
  const onSubmit = async (data: RsvpFormData) => {
    try {
      // Clear any previous errors
      setAttendanceErrorShown(false);

      // Log the start of submission and form data
      console.log("🚀 Form submission started", new Date().toISOString());
      console.log("📝 Form data:", JSON.stringify(data, null, 2));

      // Set submitting state immediately to provide user feedback
      setSubmitting(true);
      form.setValue("isSubmitting", true);

      // Use the validateAndPrepareGuestInput function to prepare the guest input
      const guestInput = validateAndPrepareGuestInput(data);

      console.log(
        "📋 Prepared guest input:",
        JSON.stringify(guestInput, null, 2)
      );

      // Execute GraphQL mutation with the prepared payload
      console.log(
        "🔄 Sending GraphQL mutation with payload:",
        JSON.stringify(guestInput, null, 2)
      );

      const result = await createRsvp({
        variables: { guest: guestInput },
        fetchPolicy: "no-cache",
        errorPolicy: "all", // This allows both data and errors to be returned
      });

      // Check for errors before showing success
      if (result.errors && result.errors.length > 0) {
        console.error("❌ GraphQL errors in result:", result.errors);
        
        // Handle GraphQL errors properly
        const firstError = result.errors[0];
        
        // Check for specific error types
        if (firstError.message.includes("email already exists") || 
            firstError.message.includes("An RSVP with this email already exists")) {
          const email = form.getValues().primaryGuest.email;
          handleDuplicateEmailError(email, {
            setError: (
              field: string,
              options: { type: string; message: string }
            ) => {
              form.setError(field as FieldPath<RsvpFormData>, options);
            },
          });
          return; // Exit early
        }
        
        // Show generic error for other GraphQL errors
        toast.error("Erreur lors de l'envoi", {
          description: firstError.message || "Une erreur s'est produite lors de l'envoi de votre RSVP.",
        });
        return; // Exit early - don't show success
      }

      // Only show success if there are no errors and we have data
      if (result.data && result.data.createRsvp) {
        console.log("✅ RSVP submission successful:", result);

        // Post-submission verification: check if guest exists in DB
        const email = data.primaryGuest.email;
        const guestName = `${data.primaryGuest.firstName} ${data.primaryGuest.lastName}`;
        
        // Use the verification utility with retry logic
        const verificationResult = await verifyRsvpInDatabase(
          apolloClient, // Use Apollo client from the mutation hook
          email,
          3, // max retries
          1000 // retry delay
        );
        
        handleVerificationResult(
          verificationResult,
          guestName,
          // Success callback
          () => {
            toast.success("RSVP soumis avec succès!", {
              description: `Merci, ${guestName}. Nous avons bien reçu votre réponse.`,
              duration: 6000,
            });
            setFormSubmitted(true);
          },
          // Error callback
          (errorMessage) => {
            if (errorMessage.includes('connection') || errorMessage.includes('network')) {
              toast.error("Erreur de connexion lors de la vérification", {
                description:
                  "Impossible de vérifier l'inscription à cause d'un problème de connexion. Votre RSVP pourrait avoir été enregistré. Veuillez vérifier ou contacter l'organisateur.",
                duration: 10000,
              });
            } else {
              toast.error("Erreur de vérification", {
                description:
                  "Votre inscription n'a pas pu être confirmée dans notre base de données. Veuillez réessayer ou contacter l'organisateur.",
                duration: 8000,
              });
            }
          }
        );
      } else {
        // No data returned - something went wrong
        console.error("❌ No data returned from RSVP creation");
        toast.error("Erreur lors de l'envoi", {
          description: "Aucune donnée reçue du serveur. Veuillez réessayer.",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);

      // Handle ApolloError specifically
      if (error instanceof ApolloError) {
        console.error("Apollo Error details:", {
          message: error.message,
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError,
        });

        // Handle network errors more specifically
        if (error.networkError) {
          console.error("Network error details:", error.networkError);
          
          // Check if it's a server error (500)
          if ('statusCode' in error.networkError && error.networkError.statusCode === 500) {
            toast.error("Erreur du Serveur", {
              description: "Le serveur rencontre des difficultés. Veuillez réessayer dans quelques minutes ou nous contacter si le problème persiste.",
            });
            return;
          }
          
          // Check if it's a connection error
          if (error.networkError.message.includes('fetch')) {
            toast.error("Erreur de Connexion", {
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.",
            });
            return;
          }
        }
        
        // Check for duplicate email error using our utility function
        if (isDuplicateEmailError(error)) {
          const email = form.getValues().primaryGuest.email;
          handleDuplicateEmailError(email, {
            setError: (
              field: string,
              options: { type: string; message: string }
            ) => {
              form.setError(field as FieldPath<RsvpFormData>, options);
            },
          });
          return; // Exit early for duplicate email error
        }

        // Check GraphQL errors array
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          console.error(
            "GraphQL errors:",
            JSON.stringify(error.graphQLErrors, null, 2)
          );

          // Check each GraphQL error for duplicate email
          const duplicateEmailError = error.graphQLErrors.find(
            (err) =>
              err.message.includes("email already exists") ||
              err.message.includes("An RSVP with this email already exists") ||
              err.message.includes("duplicate") ||
              (err.message.toLowerCase().includes("email") &&
                err.message.toLowerCase().includes("exists"))
          );

          // Check for referer validation error
          const refererError = error.graphQLErrors.find(
            (err) =>
              err.message.includes("Invalid request origin") ||
              err.extensions?.code === "INVALID_REFERER"
          );

          if (duplicateEmailError) {
            const email = form.getValues().primaryGuest.email;
            handleDuplicateEmailError(email, {
              setError: (
                field: string,
                options: { type: string; message: string }
              ) => {
                form.setError(field as FieldPath<RsvpFormData>, options);
              },
            });
            return;
          }

          // Check for capacity exceeded error
          const capacityError = error.graphQLErrors.find(
            (err) =>
              err.message.includes("maximum guest capacity") ||
              err.extensions?.code === "CAPACITY_EXCEEDED"
          );

          if (capacityError) {
            toast.error("Capacité maximale atteinte", {
              description:
                capacityError.message ||
                "Nous avons atteint la capacité maximale d'invités. Veuillez nous contacter directement.",
            });
            return;
          }

          // Handle referer validation error
          if (refererError) {
            toast.error("Erreur de sécurité", {
              description:
                "Pour des raisons de sécurité, les soumissions ne sont acceptées que depuis notre site officiel. Veuillez réessayer en utilisant le formulaire sur notre site.",
            });
            console.error("Referer validation error:", refererError);
            return;
          }

          // Check for other validation errors
          const validationError = error.graphQLErrors.find(
            (err) =>
              err.message.includes("validation") ||
              err.message.includes("required") ||
              err.message.includes("invalid")
          );

          if (validationError) {
            toast.error("Erreur de validation", {
              description:
                validationError.message ||
                "Veuillez vérifier vos saisies dans le formulaire et réessayer.",
            });
            return;
          }

          // Show the first GraphQL error if no specific handling matched
          const firstError = error.graphQLErrors[0];
          toast.error("Erreur GraphQL", {
            description:
              firstError.message ||
              "Une erreur s'est produite lors de l'envoi.",
          });
          return;
        }

        // Handle network errors
        if (error.networkError) {
          console.error(
            "Network error:",
            JSON.stringify(error.networkError, null, 2)
          );
          toast.error("Erreur de Réseau", {
            description:
              "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.",
          });
          return;
        }

        // Fallback for other Apollo errors
        toast.error("Erreur Apollo", {
          description:
            error.message || "Une erreur s'est produite lors de l'envoi.",
        });
        return;
      }

      // Handle other types of errors
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        // Check if it's still a duplicate email error even if not ApolloError
        if (isDuplicateEmailError(error)) {
          const email = form.getValues().primaryGuest.email;
          handleDuplicateEmailError(email, {
            setError: (
              field: string,
              options: { type: string; message: string }
            ) => {
              form.setError(field as FieldPath<RsvpFormData>, options);
            },
          });
          return;
        }

        toast.error("Erreur", {
          description: error.message || "Une erreur inattendue s'est produite.",
        });
        return;
      }

      // Generic error message as final fallback
      toast.error("Échec de l'envoi du RSVP", {
        description:
          "Une erreur inconnue s'est produite. Veuillez réessayer plus tard.",
      });
    } finally {
      // Always reset submission state
      setSubmitting(false);
      form.setValue("isSubmitting", false);
    }
  };
  const getFormSteps = () => {
    const attending = form.watch("primaryGuest.attending");
    const guestType = form.watch("primaryGuest.guestType");

    // For non-attending guests, only show attendance and review steps
    if (attending === AttendanceStatus.NO) {
      return [
        { title: "Attendance", component: <AttendanceStep /> },
        { title: "Review", component: <NotAttendingReviewStep /> },
      ];
    }

    // For single guests who are attending
    if (attending === AttendanceStatus.YES && guestType === GuestType.SINGLE) {
      return [
        { title: "Attendance", component: <AttendanceStep /> },
        {
          title: "Event Participation",
          component: <EventParticipationStep />,
        },
        { title: "Guest Type", component: <GuestTypeStep /> },
        // Children Info step removed
        { title: "Review", component: <ReviewStep /> },
      ];
    }

    // For couples (full flow)
    return [
      { title: "Attendance", component: <AttendanceStep /> },
      { title: "Event Participation", component: <EventParticipationStep /> },
      { title: "Guest Type", component: <GuestTypeStep /> },
      { title: "Partner Info", component: <PartnerInfoStep /> },
      // Children Info step removed
      { title: "Review", component: <ReviewStep /> },
    ];
  };

  // Get the current set of steps based on form state
  const steps = getFormSteps();

  // Check if we're on the last step
  const isLastStep = form.watch("currentStep") === steps.length - 1;
  return (
    <section
      id='rsvp'
      className={cn(
        "py-20 px-4 bg-gradient-to-b from-blue-50 to-blue-100 relative",
        className
      )}
    >
      <div className='container mx-auto'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-16'>
            <motion.div
              className='text-4xl md:text-5xl font-playfair font-bold mb-6'
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className='mb-4 text-gray-800'>RSVP</h2>
              <div className='h-1 w-24 bg-gold-500 mx-auto rounded-full'></div>
            </motion.div>

            <motion.p
              className='font-medium my-10 text-lg'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className='text-gray-700'>
                Répondez avant le 29 juin 2025
              </span>
            </motion.p>
            <CapacityIndicator />
          </div>

          <motion.div
            className='shadow-2xl bg-white/90 backdrop-blur-sm border border-gold-200 rounded-xl overflow-hidden relative'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div className='relative'>
              <Image
                src='/media/rsvp-sidney-2.png'
                alt='RSVP Invitation'
                width={500}
                height={200}
                className='w-full p-2 object-cover h-48 sm:h-56 md:h-64'
                priority
              />
            </div>

            {formSubmitted ? (
              <div className='p-8 text-center'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-playfair font-bold text-royal-600 mb-4'>
                    Merci pour votre réponse!
                  </h3>
                  <p className='text-gray-700 mb-6'>
                    Nous avons bien reçu votre RSVP et nous avons hâte de
                    partager ce moment spécial avec vous.
                  </p>

                  {/* Success details summary */}
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left'>
                    <h4 className='font-semibold text-green-800 mb-2'>
                      Détails de votre RSVP:
                    </h4>
                    <ul className='space-y-2 text-sm text-green-800'>
                      <li>
                        <span className='font-medium'>Nom:</span>{" "}
                        {`${form.getValues().primaryGuest.firstName} ${
                          form.getValues().primaryGuest.lastName
                        }`}
                      </li>
                      <li>
                        <span className='font-medium'>Présence:</span>{" "}
                        {form.getValues().primaryGuest.attending ===
                        AttendanceStatus.YES
                          ? "Présent(e)"
                          : "Absent(e)"}
                      </li>
                      {form.getValues().primaryGuest.attending ===
                        AttendanceStatus.YES && (
                        <>
                          <li>
                            <span className='font-medium'>Participation:</span>{" "}
                            {form.getValues().primaryGuest
                              .eventParticipation === EventParticipation.BOTH
                              ? "Cérémonie & Réception"
                              : form.getValues().primaryGuest
                                  .eventParticipation ===
                                EventParticipation.BLESSING_ONLY
                              ? "Cérémonie Uniquement"
                              : "Réception Uniquement"}
                          </li>
                          {form.getValues().primaryGuest.guestType ===
                            GuestType.COUPLE && (
                            <li>
                              <span className='font-medium'>Partenaire:</span>{" "}
                              {`${form.getValues().primaryGuest.partnerFirstName || ''} ${form.getValues().primaryGuest.partnerLastName || ''}`.trim() || 
                               form.getValues().primaryGuest.partnerName || 'Non spécifié'}
                            </li>
                          )}
                          {form.getValues().primaryGuest.hasChildren &&
                            form.getValues().primaryGuest.children.length >
                              0 && (
                              <li>
                                <span className='font-medium'>Enfants:</span>{" "}
                                {form.getValues().primaryGuest.children.length}
                              </li>
                            )}
                          {/* {form.getValues().primaryGuest
                            .dietaryRequirements && (
                            <li>
                              <span className='font-medium'>
                                Dietary Requirements:
                              </span>{" "}
                              {
                                form.getValues().primaryGuest
                                  .dietaryRequirements
                              }
                            </li>
                          )} */}
                        </>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={resetForm}
                    className='bg-royal-600 text-white px-6 py-2 rounded-full gold-hover-effect'
                  >
                    Soumettre une autre réponse
                  </Button>
                </motion.div>
              </div>
            ) : (
              <FormProvider {...form}>
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      console.log("Form submit event triggered");

                      // Set a flag to indicate we're submitting
                      form.setValue("isSubmitting", true);

                      // Force validation of all fields before submission
                      form.trigger().then((isValid) => {
                        if (isValid) {
                          console.log("Form is valid, submitting...");
                          form.handleSubmit(
                            onSubmit as SubmitHandler<FieldValues>
                          )(e);
                        } else {
                          // Improved error logging with structured format for better debugging
                          console.log(
                            "Form validation failed:",
                            JSON.stringify(form.formState.errors, null, 2)
                          );

                          // Extract error fields and messages for more helpful user feedback
                          const errorFields = Object.keys(
                            form.formState.errors
                          );
                          const firstErrorField = errorFields[0];
                          const firstErrorMessage = firstErrorField
                            ? form.formState.errors[
                                firstErrorField as keyof typeof form.formState.errors
                              ]?.message || "Champ invalide"
                            : "Veuillez remplir correctement tous les champs obligatoires";

                          // Show a more specific error message to the user
                          toast.error("Erreur de validation", {
                            description: `${firstErrorMessage}. Veuillez vérifier ${errorFields.join(
                              ", "
                            )}.`,
                          });

                          form.setValue("isSubmitting", false);
                        }
                      });
                    }}
                    className='space-y-6 p-8'
                    name='rsvp-form'
                  >
                    {/* Progress Steps */}
                    <div className='mb-8'>
                      <div className='flex justify-between items-center mb-2'>
                        {steps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col items-center relative group ${
                              idx <= maxVisitedStep ? "cursor-pointer" : ""
                            }`}
                            onClick={() =>
                              idx <= maxVisitedStep ? goToStep(idx) : null
                            }
                            role={idx <= maxVisitedStep ? "button" : undefined}
                            tabIndex={idx <= maxVisitedStep ? 0 : undefined}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && idx <= maxVisitedStep) {
                                goToStep(idx);
                              }
                            }}
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 
                                ${
                                  idx < currentStep
                                    ? "bg-royal-600 border-royal-600 text-white"
                                    : idx === currentStep
                                    ? "border-royal-600 text-royal-600"
                                    : idx <= maxVisitedStep
                                    ? "border-gray-400 text-gray-500 hover:border-royal-400 hover:text-royal-500"
                                    : "border-gray-300 text-gray-300"
                                }
                                ${
                                  idx <= maxVisitedStep ? "hover:shadow-md" : ""
                                }
                                `}
                            >
                              {idx < currentStep ? (
                                <Check className='w-5 h-5' />
                              ) : (
                                <span className='text-sm'>{idx + 1}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs mt-2 text-center font-medium max-w-[90px] transition-all
                                ${
                                  idx === currentStep
                                    ? "text-royal-600 font-bold"
                                    : idx < currentStep
                                    ? "text-gray-700"
                                    : idx <= maxVisitedStep
                                    ? "text-gray-600 group-hover:text-royal-500"
                                    : "text-gray-400"
                                }`}
                            >
                              {step.title}
                            </span>
                            {/* Connector line between steps */}
                            {idx < steps.length - 1 && (
                              <div className='hidden md:flex absolute left-full transform translate-x-1 items-center w-full'>
                                <div
                                  className={`h-0.5 w-full ${
                                    idx < currentStep
                                      ? "bg-royal-500"
                                      : "bg-gray-200"
                                  } transition-all duration-500`}
                                ></div>
                                {idx < currentStep && (
                                  <ChevronRight className='text-royal-500 w-4 h-4 ml-0.5 animate-pulse' />
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className='relative mt-3 hidden md:block'>
                        <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full'></div>
                        <div
                          className='absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-royal-600 rounded-full transition-all duration-500 ease-in-out'
                          style={{
                            width: `${
                              (currentStep / (steps.length - 1)) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Current Step Label */}
                    <div className='text-center mb-6'>
                      <h3 className='text-xl font-medium text-royal-600'>
                        {steps[currentStep].title === "Attendance"
                          ? "Présence"
                          : steps[currentStep].title === "Event Participation"
                          ? "Participation"
                          : steps[currentStep].title === "Guest Type"
                          ? "Type d'invité"
                          : steps[currentStep].title === "Partner Info"
                          ? "Informations du partenaire"
                          : steps[currentStep].title === "Children Info"
                          ? "Informations des enfants"
                          : steps[currentStep].title === "Review"
                          ? "Vérification"
                          : steps[currentStep].title}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Étape {currentStep + 1} sur {steps.length}
                      </p>
                    </div>

                    {/* Step Content */}
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className='min-h-[300px]'
                    >
                      {steps[currentStep].component}
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className='flex justify-between mt-8'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`${
                          currentStep === 0 ? "invisible" : ""
                        } flex items-center gap-2 border-royal-300 text-royal-600 hover:bg-royal-50 hover:border-royal-400 transition-all duration-300 transform hover:scale-105 active:scale-95`}
                      >
                        <ArrowLeft className='w-4 h-4' /> Précédent
                      </Button>

                      {isLastStep ? (
                        <Button
                          type='submit'
                          name='submit-rsvp'
                          className='bg-royal-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-royal-700 active:scale-95 shadow-md hover:shadow-lg'
                          disabled={submitting || loading}
                          aria-disabled={submitting || loading}
                          onClick={() => {
                            // Add this line for immediate visual feedback
                            if (!submitting && !loading) {
                              toast.info("Traitement de votre soumission...");
                              console.log(
                                "Submit button clicked",
                                new Date().toISOString()
                              );
                            }
                          }}
                        >
                          {submitting || loading ? (
                            <div className='flex items-center justify-center'>
                              <svg
                                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              Envoi en cours...
                            </div>
                          ) : (
                            "Envoyer ma réponse"
                          )}
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          onClick={nextStep}
                          className='bg-royal-600 text-white flex items-center gap-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-royal-700 active:scale-95 shadow-md hover:shadow-lg'
                        >
                          Suivant <ArrowRight className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </FormProvider>
            )}
          </motion.div>

          <motion.div
            className='text-center mt-10 text-gray-600 text-sm italic'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className='font-playfair'>
              Que l&#39;Éternel te bénisse et te garde! Que l&#39;Éternel fasse
              luire sa face sur toi et t’accorde sa grâce! Que l&#39;Éternel se
              tourne vers toi et te donne la paix! Nombres 6:24-26
              <br />
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
