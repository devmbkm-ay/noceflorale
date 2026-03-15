import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type RsvpFormData } from "./validation";
import { AttendanceStatus, EventParticipation, GuestType } from "./types";

interface SuccessPageProps {
  onReset: () => void;
  formData: RsvpFormData;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onReset, formData }) => {

  return (
    <div className="p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-playfair font-bold text-royal-600 mb-4">
          Merci pour votre réponse!
        </h3>
        <p className="text-gray-700 mb-6">
          Nous avons bien reçu votre RSVP et nous avons hâte de
          partager ce moment spécial avec vous.
        </p>

        {/* Success details summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-semibold text-green-800 mb-2">
            Détails de votre RSVP:
          </h4>
          <ul className="space-y-2 text-sm text-green-800">
            <li>
              <span className="font-medium">Nom:</span>{" "}
              {`${formData.primaryGuest.firstName} ${
                formData.primaryGuest.lastName
              }`}
            </li>
            <li>
              <span className="font-medium">Présence:</span>{" "}
              {formData.primaryGuest.attending ===
              AttendanceStatus.YES
                ? "Présent(e)"
                : "Absent(e)"}
            </li>
            {formData.primaryGuest.attending ===
              AttendanceStatus.YES && (
              <>
                <li>
                  <span className="font-medium">Participation:</span>{" "}
                  {formData.primaryGuest
                    .eventParticipation === EventParticipation.BOTH
                    ? "Cérémonie & Réception"
                    : formData.primaryGuest
                        .eventParticipation ===
                      EventParticipation.BLESSING_ONLY
                    ? "Cérémonie Uniquement"
                    : "Réception Uniquement"}
                </li>
                {formData.primaryGuest.guestType ===
                  GuestType.COUPLE && (
                  <li>
                    <span className="font-medium">Partenaire:</span>{" "}
                    {`${formData.primaryGuest.partnerFirstName || ''} ${formData.primaryGuest.partnerLastName || ''}`.trim() || 
                     formData.primaryGuest.partnerName || 'Non spécifié'}
                  </li>
                )}
                {formData.primaryGuest.hasChildren &&
                  formData.primaryGuest.children.length >
                    0 && (
                    <li>
                      <span className="font-medium">Enfants:</span>{" "}
                      {formData.primaryGuest.children.length}
                    </li>
                  )}
              </>
            )}
          </ul>
        </div>

        <Button
          onClick={onReset}
          className="bg-royal-600 text-white px-6 py-2 rounded-full gold-hover-effect"
        >
          Soumettre une autre réponse
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
