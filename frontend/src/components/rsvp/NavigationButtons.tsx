import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface NavigationButtonsProps {
  currentStep: number;
  isLastStep: boolean;
  submitting: boolean;
  loading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isLastStep,
  submitting,
  loading,
  onPrevStep,
  onNextStep,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 0}
        className={`${
          currentStep === 0 ? "invisible" : ""
        } flex items-center gap-2 border-royal-300 text-royal-600 hover:bg-royal-50 hover:border-royal-400 transition-all duration-300 transform hover:scale-105 active:scale-95`}
      >
        <ArrowLeft className="w-4 h-4" /> Précédent
      </Button>

      {isLastStep ? (
        <Button
          type="submit"
          name="submit-rsvp"
          className="bg-royal-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-royal-700 active:scale-95 shadow-md hover:shadow-lg"
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
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
          type="button"
          onClick={onNextStep}
          className="bg-royal-600 text-white flex items-center gap-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-royal-700 active:scale-95 shadow-md hover:shadow-lg"
        >
          Suivant <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
