import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestInformation } from "./GuestInformation";
import { EventSelection } from "./EventSelection";
import { ConfirmationSummary } from "./ConfirmationSummary";
import { Stepper } from '@/components/ui/stepper';

// Define the schema for RSVP validation
const rsvpSchema = z.object({
  invitationCode: z.string().min(1, "Invitation code is required"),
  guests: z.array(z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    isAttending: z.boolean(),
  })).min(1),
  events: z.object({
    ceremony: z.object({
      isAttending: z.boolean(),
      attendeeIds: z.array(z.number()).default([]),
    }),
    reception: z.object({
      isAttending: z.boolean(),
      attendeeIds: z.array(z.number()).optional(),
    }),
  }),
  additionalNotes: z.string().optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  onSubmit: (data: RSVPFormData) => Promise<void>;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCoupleInvitation, setIsCoupleInvitation] = useState(false);
  
  const steps = [
    { title: "Invitation", description: "Enter your invitation code" },
    { title: "Guest Information", description: "Tell us about yourself" },
    { title: "Event Selection", description: "Which events will you attend?" },
    { title: "Confirmation", description: "Review your RSVP" },
  ];

  const form = useForm<RSVPFormData>({
    
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      invitationCode: "",
      guests: [{ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        dietaryRestrictions: "",
        isAttending: true 
      }],
      events: {
        ceremony: { isAttending: false, attendeeIds: [] as number[] },
        reception: { isAttending: false, attendeeIds: [] as number[] },
      },
      additionalNotes: "",
    },
  });

  const handleNext = async () => {
    // Validate current step
    const fieldsToValidate = getFieldsToValidateForStep(currentStep);
    const isStepValid = await form.trigger(fieldsToValidate as (keyof RSVPFormData)[]);
    
    if (isStepValid) {
      if (currentStep === 0) {
        // Here you would typically verify the invitation code
        // and determine if it's for a couple or individual
        const invitationCode = form.getValues("invitationCode");
        
        // Mock validation - in real app, this would be an API call
        if (invitationCode) {
          // Example: codes ending with "C" are for couples
          setIsCoupleInvitation(invitationCode.endsWith("C"));
          
          // If it's a couple, add a second guest
          if (invitationCode.endsWith("C") && form.getValues("guests").length === 1) {
            form.setValue("guests", [
              ...form.getValues("guests"),
              { 
                firstName: "", 
                lastName: "", 
                email: "", 
                phone: "", 
                dietaryRestrictions: "",
                isAttending: true 
              }
            ]);
          }
          
          setCurrentStep(currentStep + 1);
        }
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = form.getValues();
      await onSubmit(formData);
      // Show success notification or redirect
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine which fields to validate based on current step
  const getFieldsToValidateForStep = (step: number) => {
    switch (step) {
      case 0:
        return ["invitationCode"];
      case 1:
        return ["guests"];
      case 2:
        return ["events"];
      case 3:
      default:
        return [];
    }
  };
const guestForm = useForm<{
  guests: {
    isAttending: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dietaryRestrictions?: string;
  }[];
}>({
  mode: "onChange",
  resolver: zodResolver(
    z.object({
      guests: z.array(
        z.object({
          isAttending: z.boolean(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email("Invalid email address").optional(),
          phone: z.string().optional(),
          dietaryRestrictions: z.string().optional(),
        })
      ),
    })
  ),
});

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="invitationCode" className="block text-sm font-medium">
                Invitation Code
              </label>
              <input
                id="invitationCode"
                {...form.register("invitationCode")}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your invitation code"
              />
              {form.formState.errors.invitationCode && (
                <p className="text-red-500 text-sm">{form.formState.errors.invitationCode.message}</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <GuestInformation 
            form={guestForm as UseFormReturn<{
              guests: {
                isAttending: boolean;
                firstName?: string;
                lastName?: string;
                email?: string;
                phone?: string;
                dietaryRestrictions?: string;
              }[];
            }>} 
            isCoupleInvitation={isCoupleInvitation} 
          />
        );
      case 2:
        return (
          <EventSelection 
            form={form as unknown as UseFormReturn<{
              events: {
                ceremony: { attendeeIds: number[]; isAttending: boolean; };
                reception: { attendeeIds: number[]; isAttending: boolean; };
              };
              additionalNotes: string;
            }>} 
            guestsAttending={form.getValues("guests").filter(g => g.isAttending)}
          />
        );
      case 3:
        return (
          <ConfirmationSummary 
            formData={form.getValues()} 
          />
        );
      default:
        return null;
    }
  };  return (    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>RSVP</CardTitle>
        <CardDescription>
          We&apos;re excited to celebrate with you! Please complete this form to let us know if you&apos;ll be joining us.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Stepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(step: number) => {
        // Only allow clicking on completed steps
        if (step < currentStep) {
          setCurrentStep(step);
        }
          }} 
        />
        
        <div className="mt-6">
          {renderCurrentStep()}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStep === steps.length - 1 ? "Submit RSVP" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};