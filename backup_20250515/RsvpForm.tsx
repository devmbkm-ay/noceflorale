import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useForm,
  FormProvider,
  FieldPath,
  useFormContext as useReactHookFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { rsvpFormSchema, type RsvpFormData } from "./validation";
import { AttendanceStatus, EventParticipation, GuestType } from "./types";
import { CREATE_RSVP, PrimaryGuestInput } from "@/graphql/rsvp";
import { useMutation, ApolloError } from "@apollo/client";
import AttendanceStep from "./steps/AttendanceStep";
import GuestTypeStep from "./steps/GuestTypeStep";
import EventParticipationStep from "./steps/EventParticipationStep";
import PartnerInfoStep from "./steps/PartnerInfoStep";
import ChildrenInfoStep from "./steps/ChildrenInfoStep";
import ReviewStep from "./steps/ReviewStep";
// import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import Image from "next/image";
import { Check, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { CheckCircle } from "lucide-react";

// Helper function to use the form context with proper typing
function useFormContext() {
  return useReactHookFormContext<RsvpFormData>();
}

// Component to display a simplified review for non-attending guests
const NotAttendingReviewStep: React.FC = () => {
  const { watch } = useFormContext();
  const name = watch("primaryGuest.name");
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
          Thank you for your response
        </h3>
        <p className='text-gray-600 mb-4'>
          We are sorry but we appreciate you letting us know.
        </p>
        <div className='bg-white rounded-lg p-4 shadow-sm max-w-md mx-auto'>
          <h4 className='font-medium text-gray-700 mb-2 border-b pb-2'>
            Your Information
          </h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Name:</span>
              <span className='font-medium'>{name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium'>{email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Attendance:</span>
              <span className='font-medium text-red-500'>Not Attending</span>
            </div>
          </div>
        </div>
      </div>
      <p className='text-center text-sm text-gray-500 italic'>
        Please review your information before submitting your response.
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
      name: data.primaryGuest.name,
      email: data.primaryGuest.email,
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
          : "evening_only"
        : "none",
      hasChildren: Boolean(data.primaryGuest.hasChildren),
      childrenCount: data.primaryGuest.hasChildren
        ? data.primaryGuest.childrenCount || 0
        : 0,
      children: data.primaryGuest.hasChildren
        ? data.primaryGuest.children?.filter(
            (child) => child && child.name && child.age
          ) || []
        : [],
      // Always initialize partner fields with empty strings
      partnerName: "",
      partnerEmail: "",
      partnerEventParticipation: "none",
    };

    // For single guests, ensure partner fields are undefined
    if (isAttending && isSingle) {
      // Clear any partner data for single guests
      baseInput.partnerName = undefined;
      baseInput.partnerEmail = undefined;
      baseInput.partnerEventParticipation = undefined;
    }
    // Only set partner info for couples who are attending
    else if (isAttending && !isSingle) {
      if (data.primaryGuest.partnerName) {
        baseInput.partnerName = data.primaryGuest.partnerName;
      }

      if (data.primaryGuest.partnerEmail) {
        baseInput.partnerEmail = data.primaryGuest.partnerEmail.toLowerCase();
      }

      if (data.primaryGuest.partnerEventParticipation) {
        baseInput.partnerEventParticipation =
          data.primaryGuest.partnerEventParticipation;
      }
    }

    // Handle children if present and valid
    if (data.primaryGuest.hasChildren) {
      // If there are no children yet but hasChildren is true,
      // still need to maintain this flag
      if (
        !data.primaryGuest.children ||
        data.primaryGuest.children.length === 0
      ) {
        // Just ensure the counts are consistent with the flag
        baseInput.hasChildren = true;
        baseInput.childrenCount = 0;
        baseInput.children = [];
      } else {
        // Filter and validate children data
        const validChildren = data.primaryGuest.children
          .filter(
            (child) =>
              child &&
              typeof child.name === "string" &&
              child.name.trim().length >= 2 &&
              typeof child.age === "number" &&
              child.age >= 2 &&
              child.age <= 12
          )
          .map((child) => ({
            name: child.name.trim(),
            age: child.age,
          }));

        // Always update both the array and the count
        baseInput.childrenCount = validChildren.length;
        baseInput.children = validChildren;
      }
    } else {
      // If hasChildren is false, ensure childrenCount and children array are empty
      baseInput.hasChildren = false;
      baseInput.childrenCount = 0;
      baseInput.children = [];
    }

    return baseInput;
  };

  // Setup GraphQL mutation
  const [createRsvp, { loading }] = useMutation(CREATE_RSVP, {
    onError: (error) => {
      console.error("GraphQL Error:", error);

      // Check for specific error related to event participation for non-attending guests
      if (
        error.message.includes(
          "Event participation cannot be set for non-attending guests"
        )
      ) {
        toast.error("Validation Error", {
          description: "Non-attending guests cannot be assigned to events.",
        });
        setAttendanceErrorShown(true);
      } else {
        toast.error("Failed to submit RSVP", {
          description: error.message || "Please try again later.",
        });
      }
    },
  });

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      primaryGuest: {
        name: "",
        email: "",
        attending: AttendanceStatus.YES,
        guestType: GuestType.SINGLE,
        // Set eventParticipation to NONE if not attending, otherwise BOTH
        eventParticipation: AttendanceStatus.YES
          ? EventParticipation.BOTH
          : EventParticipation.NONE,
        partnerName: undefined, // Use undefined instead of empty string to avoid validation
        partnerEmail: undefined, // Use undefined instead of empty string to avoid validation
        // Set partnerEventParticipation to NONE if not attending, otherwise BOTH
        partnerEventParticipation: AttendanceStatus.YES
          ? EventParticipation.BOTH
          : EventParticipation.NONE,
        hasChildren: false,
        children: [],
        childrenCount: 0,
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
        // Skip to Children Info step (index 4 in the full flow)
        // We need to find the index of the Children Info step in the current steps array
        const childrenStepIndex = currentSteps.findIndex(
          (step) => step.title === "Children Info"
        );

        if (childrenStepIndex !== -1) {
          setCurrentStep(childrenStepIndex);
          setMaxVisitedStep((prev) => Math.max(prev, childrenStepIndex));
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
        "Please fill in all required fields correctly before proceeding."
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
    const hasChildren = form.watch("primaryGuest.hasChildren");
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
          "primaryGuest.name",
          "primaryGuest.email",
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
          "primaryGuest.name",
          "primaryGuest.email",
          "primaryGuest.attending",
        ] as FieldPath<RsvpFormData>[];

      case "Event Participation":
        return ["primaryGuest.eventParticipation"] as FieldPath<RsvpFormData>[];

      case "Guest Type":
        return ["primaryGuest.guestType"] as FieldPath<RsvpFormData>[];

      case "Partner Info":
        return guestType === GuestType.COUPLE
          ? ([
              "primaryGuest.partnerName",
              "primaryGuest.partnerEmail",
              "primaryGuest.partnerEventParticipation",
            ] as FieldPath<RsvpFormData>[])
          : [];

      case "Children Info":
        return hasChildren
          ? ([
              "primaryGuest.childrenCount",
              "primaryGuest.children",
            ] as FieldPath<RsvpFormData>[])
          : [];

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

      // Use the complete guestInput object for the GraphQL mutation instead of the limited singleGuestData
      const result = await createRsvp({
        variables: { guest: guestInput },
        // Add these options to help with potential network issues
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      console.log("✅ RSVP submission successful:", result);

      // Show success toast notification
      toast.success("RSVP soumis avec succès!", {
        description: `Merci, ${data.primaryGuest.name}. Nous avons bien reçu votre réponse.`,
      });

      // Set form as submitted
      setFormSubmitted(true);
    } catch (error) {
      console.error("❌ Form submission error:", error);

      // Add detailed error logging to help debugging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        // For GraphQL errors, log the specific error details
        if (error instanceof ApolloError) {
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            console.error(
              "GraphQL errors:",
              JSON.stringify(error.graphQLErrors, null, 2)
            );

            // Check for specific validation errors
            const validationError = error.graphQLErrors.find(
              (err) =>
                err.message.includes("validation") ||
                err.message.includes("required") ||
                err.message.includes("invalid")
            );

            if (validationError) {
              toast.error("Validation Error", {
                description:
                  validationError.message ||
                  "Please check your form inputs and try again.",
              });
              return; // Exit early for validation errors
            }
          }

          if (error.networkError) {
            console.error(
              "Network error:",
              JSON.stringify(error.networkError, null, 2)
            );
            toast.error("Network Error", {
              description:
                "Unable to connect to the server. Please check your internet connection and try again.",
            });
            return; // Exit early for network errors
          }
        }
      }

      // Generic error message as fallback
      toast.error("Failed to submit RSVP", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      // Only reset submission state if there was an error
      if (!formSubmitted) {
        setSubmitting(false);
        form.setValue("isSubmitting", false);
      }
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
        { title: "Children Info", component: <ChildrenInfoStep /> },
        { title: "Review", component: <ReviewStep /> },
      ];
    }

    // For couples (full flow)
    return [
      { title: "Attendance", component: <AttendanceStep /> },
      { title: "Event Participation", component: <EventParticipationStep /> },
      { title: "Guest Type", component: <GuestTypeStep /> },
      { title: "Partner Info", component: <PartnerInfoStep /> },
      { title: "Children Info", component: <ChildrenInfoStep /> },
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
                Répondez avant le 10 juillet 2025
              </span>
            </motion.p>
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
                src='/media/rsvp-sidney-2.webp'
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
                        {form.getValues().primaryGuest.name}
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
                              {form.getValues().primaryGuest.partnerName}
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
                          form.handleSubmit(onSubmit)(e);
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
                              ]?.message || "Invalid field"
                            : "Please fill in all required fields correctly";

                          // Show a more specific error message to the user
                          toast.error("Validation Error", {
                            description: `${firstErrorMessage}. Please check ${errorFields.join(
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
              Nous avons hâte de partager ce moment avec vous!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
