import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { rsvpFormSchema, type RsvpFormData } from "../validation";
import { AttendanceStatus, EventParticipation, GuestType } from "../types";
import { CREATE_RSVP } from "@/graphql/rsvp";

export const useRsvpForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [attendanceErrorShown, setAttendanceErrorShown] = useState(false);

  const [createRsvp, { loading }] = useMutation(CREATE_RSVP, {
    onError: (error) => {
      console.error("GraphQL Error:", error);

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

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      primaryGuest: {
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        attending: AttendanceStatus.YES,
        guestType: GuestType.SINGLE,
        eventParticipation: AttendanceStatus.YES
          ? EventParticipation.BOTH
          : EventParticipation.NONE,
        partnerFirstName: undefined,
        partnerLastName: undefined,
        partnerName: undefined,
        partnerEmail: undefined,
        partnerTelephone: undefined,
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
    criteriaMode: "all",
  });

  useEffect(() => {
    form.setValue("currentStep", currentStep);
  }, [currentStep, form]);

  const attendingStatus = form.watch("primaryGuest.attending");

  useEffect(() => {
    if (attendingStatus === AttendanceStatus.NO) {
      form.setValue("primaryGuest.eventParticipation", EventParticipation.NONE);
      form.setValue(
        "primaryGuest.partnerEventParticipation",
        EventParticipation.NONE
      );
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

  return {
    form,
    submitting,
    setSubmitting,
    formSubmitted,
    setFormSubmitted,
    currentStep,
    setCurrentStep,
    maxVisitedStep,
    setMaxVisitedStep,
    attendanceErrorShown,
    setAttendanceErrorShown,
    createRsvp,
    loading,
    resetForm,
  };
};
