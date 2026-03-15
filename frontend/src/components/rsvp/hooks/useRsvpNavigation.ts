import { toast } from "sonner";
import { AttendanceStatus, GuestType } from "../types";
import { getFieldsToValidateForStep } from "../utils/formUtils";
import { UseFormReturn } from "react-hook-form";
import { RsvpFormData } from "../validation";

// Helper functions to reduce complexity
const handleNotAttendingNavigation = (
  currentStep: number,
  totalSteps: number,
  form: UseFormReturn<RsvpFormData>,
  setCurrentStep: (step: number) => void,
  setMaxVisitedStep: (setter: (prev: number) => number) => void
) => {
  if (currentStep === 0 && form.getValues().primaryGuest.attending === AttendanceStatus.NO) {
    const finalStepIndex = totalSteps - 1;
    // Preserve event participation values
    form.setValue("primaryGuest.eventParticipation", form.getValues().primaryGuest.eventParticipation);
    form.setValue("primaryGuest.partnerEventParticipation", form.getValues().primaryGuest.partnerEventParticipation);
    setCurrentStep(finalStepIndex);
    setMaxVisitedStep((prev) => Math.max(prev, finalStepIndex));
    return true;
  }
  return false;
};

const handleSingleGuestNavigation = (
  currentStep: number,
  form: UseFormReturn<RsvpFormData>,
  currentSteps: { title: string; component: React.ReactNode }[],
  setCurrentStep: (step: number) => void,
  setMaxVisitedStep: (setter: (prev: number) => number) => void
) => {
  if (currentStep === 2 && form.getValues().primaryGuest.guestType === GuestType.SINGLE) {
    const reviewStepIndex = currentSteps.findIndex((step) => step.title === "Review");
    if (reviewStepIndex !== -1) {
      setCurrentStep(reviewStepIndex);
      setMaxVisitedStep((prev) => Math.max(prev, reviewStepIndex));
    } else {
      const nextStepIndex = Math.min(currentStep + 1, currentSteps.length - 1);
      setCurrentStep(nextStepIndex);
      setMaxVisitedStep((prev) => Math.max(prev, nextStepIndex));
    }
    return true;
  }
  return false;
};

const handleRegularNavigation = (
  currentStep: number,
  totalSteps: number,
  setCurrentStep: (step: number) => void,
  setMaxVisitedStep: (setter: (prev: number) => number) => void
) => {
  const nextStepIndex = Math.min(currentStep + 1, totalSteps - 1);
  setCurrentStep(nextStepIndex);
  setMaxVisitedStep((prev) => Math.max(prev, nextStepIndex));
};

interface UseRsvpNavigationProps {
  form: UseFormReturn<RsvpFormData>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  maxVisitedStep: number;
  setMaxVisitedStep: (setter: (prev: number) => number) => void;
  getFormSteps: () => { title: string; component: React.ReactNode }[];
}

export const useRsvpNavigation = ({
  form,
  currentStep,
  setCurrentStep,
  maxVisitedStep,
  setMaxVisitedStep,
  getFormSteps,
}: UseRsvpNavigationProps) => {
  const nextStep = async () => {
    const currentSteps = getFormSteps();
    const TOTAL_STEPS = currentSteps.length;
    const isValid = await form.trigger(
      getFieldsToValidateForStep(
        currentStep,
        form.getValues().primaryGuest.attending,
        form.getValues().primaryGuest.guestType ?? GuestType.SINGLE,
        currentSteps
      )
    );

    if (isValid) {
      if (handleNotAttendingNavigation(currentStep, TOTAL_STEPS, form, setCurrentStep, setMaxVisitedStep)) return;
      if (handleSingleGuestNavigation(currentStep, form, currentSteps, setCurrentStep, setMaxVisitedStep)) return;
      handleRegularNavigation(currentStep, TOTAL_STEPS, setCurrentStep, setMaxVisitedStep);
    } else {
      toast.error(
        "Veuillez remplir correctement tous les champs obligatoires avant de continuer."
      );
      const errors = form.formState.errors;
      console.log("Form validation errors:", errors);
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= maxVisitedStep || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
      setMaxVisitedStep((prev) => Math.max(prev, stepIndex));
    }
  };

  return {
    nextStep,
    prevStep,
    goToStep,
  };
};
