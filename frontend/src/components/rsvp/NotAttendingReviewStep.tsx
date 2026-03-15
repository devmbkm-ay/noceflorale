import React from "react";
import { useFormContext as useReactHookFormContext } from "react-hook-form";
import { CheckCircle } from "lucide-react";
import { type RsvpFormData } from "./validation";

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
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Merci pour votre réponse
        </h3>
        <p className="text-gray-600 mb-4">
          Nous sommes désolés mais nous apprécions que vous nous le fassiez
          savoir.
        </p>
        <div className="bg-white rounded-lg p-4 shadow-sm max-w-md mx-auto">
          <h4 className="font-medium text-gray-700 mb-2 border-b pb-2">
            Vos Informations
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom:</span>
              <span className="font-medium">
                {firstName} {lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Présence:</span>
              <span className="font-medium text-red-500">
                Ne sera pas présent(e)
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 italic">
        Veuillez vérifier vos informations avant d&apos;envoyer votre réponse.
      </p>
    </div>
  );
};

export default NotAttendingReviewStep;
