import React from "react";
import { AttendanceStatus, GuestType } from "./types";
import AttendanceStep from "./steps/AttendanceStep";
import GuestTypeStep from "./steps/GuestTypeStep";
import EventParticipationStep from "./steps/EventParticipationStep";
import PartnerInfoStep from "./steps/PartnerInfoStep";
import ReviewStep from "./steps/ReviewStep";
import NotAttendingReviewStep from "./NotAttendingReviewStep";

interface FormStepsProviderProps {
  attending: AttendanceStatus | undefined;
  guestType: GuestType | undefined;
}

export const useFormSteps = ({ attending, guestType }: FormStepsProviderProps) => {
  // Provide default values if undefined
  const safeAttending = attending ?? AttendanceStatus.YES;
  const safeGuestType = guestType ?? GuestType.SINGLE;
  const getFormSteps = () => {
    if (safeAttending === AttendanceStatus.NO) {
      return [
        { title: "Attendance", component: <AttendanceStep /> },
        { title: "Review", component: <NotAttendingReviewStep /> },
      ];
    }

    if (safeAttending === AttendanceStatus.YES && safeGuestType === GuestType.SINGLE) {
      return [
        { title: "Attendance", component: <AttendanceStep /> },
        {
          title: "Event Participation",
          component: <EventParticipationStep />,
        },
        { title: "Guest Type", component: <GuestTypeStep /> },
        { title: "Review", component: <ReviewStep /> },
      ];
    }

    return [
      { title: "Attendance", component: <AttendanceStep /> },
      { title: "Event Participation", component: <EventParticipationStep /> },
      { title: "Guest Type", component: <GuestTypeStep /> },
      { title: "Partner Info", component: <PartnerInfoStep /> },
      { title: "Review", component: <ReviewStep /> },
    ];
  };

  return { getFormSteps };
};
