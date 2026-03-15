import React, { createContext, useContext, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

// Schema definitions
export const partnerSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }).optional(),
});

export const childSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  age: z.string().min(1, { message: "Veuillez indiquer l'âge de l'enfant." }),
});

export const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  telephone: z.string().min(10, { message: "Veuillez entrer un numéro de téléphone valide." }),
  attending: z.enum(["oui", "non"], {
    required_error: "Veuillez indiquer si vous serez présent.",
  }),
  hasPartner: z.enum(["oui", "non"], {
    required_error: "Veuillez indiquer si vous venez accompagné.",
  }),
  partner: partnerSchema.optional(),
  hasKids: z.enum(["oui", "non"], {
    required_error: "Veuillez indiquer si vous venez avec des enfants.",
  }),
  children: z.array(childSchema).optional(),
  attendBlessing: z.enum(["oui", "non"], {
    required_error: "Veuillez indiquer si vous assisterez à la bénédiction.",
  }),
  attendReception: z.enum(["oui", "non"], {
    required_error: "Veuillez indiquer si vous assisterez à la réception du soir.",
  }),
  partnerAttendBlessing: z.enum(["oui", "non"]).optional().nullable(),
  partnerAttendReception: z.enum(["oui", "non"]).optional().nullable(),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type ChildValues = z.infer<typeof childSchema>;

interface RsvpFormContextType {
  formValues: FormValues;
  children: ChildValues[];
  currentStep: number;
  isSubmitting: boolean;
  submitted: boolean;
  setFormValues: (values: Partial<FormValues>) => void;
  setChildren: React.Dispatch<React.SetStateAction<ChildValues[]>>;
  addChild: () => void;
  removeChild: (index: number) => void;
  updateChild: (index: number, field: keyof ChildValues, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const defaultFormValues: FormValues = {
  name: "",
  email: "",
  telephone: "",
  attending: "oui",
  hasPartner: "non",
  partner: {
    fullName: "",
    email: "",
  },
  hasKids: "non",
  children: [],
  attendBlessing: "oui",
  attendReception: "oui",
  partnerAttendBlessing: "oui",
  partnerAttendReception: "oui",
  dietaryRestrictions: "",
  notes: "",
};

const RsvpFormContext = createContext<RsvpFormContextType | undefined>(undefined);

export const RsvpFormProvider: React.FC<{ children: React.ReactNode }> = ({ children: childrenProp }) => {
  const [formValues, setFormValuesState] = useState<FormValues>(defaultFormValues);
  const [children, setChildren] = useState<ChildValues[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setFormValues = (values: Partial<FormValues>) => {
    setFormValuesState(prev => ({ ...prev, ...values }));
  };

  const addChild = () => {
    setChildren(prev => [...prev, { fullName: "", age: "" }]);
  };

  const removeChild = (index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof ChildValues, value: string) => {
    setChildren(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare final form data
      const finalData = { 
        ...formValues,
        children: formValues.hasKids === "oui" ? children : []
      };
      
      // If user doesn't have a partner, remove partner attendance fields
      if (finalData.hasPartner === "non") {
        finalData.partnerAttendBlessing = null;
        finalData.partnerAttendReception = null;
      }
      
      // Validate the data with Zod
      formSchema.parse(finalData);
      
      // In a real implementation, you would send this data to your backend
      console.log("Submitting form data:", finalData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Réponse envoyée avec succès !", {
        description: `Merci, ${finalData.name}. Nous avons bien reçu votre réponse.`,
      });
      
      setSubmitted(true);
      
      // After 3 seconds, reset the form and step
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Veuillez corriger les erreurs dans le formulaire", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("Une erreur est survenue", {
          description: "Veuillez réessayer plus tard.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormValuesState(defaultFormValues);
    setChildren([]);
    setCurrentStep(1);
    setSubmitted(false);
  };

  return (
    <RsvpFormContext.Provider
      value={{
        formValues,
        children,
        currentStep,
        isSubmitting,
        submitted,
        setFormValues,
        setChildren,
        addChild,
        removeChild,
        updateChild,
        nextStep,
        prevStep,
        submitForm,
        resetForm,
      }}
    >
      {childrenProp}
    </RsvpFormContext.Provider>
  );
};
export const useRsvpForm = () => {
  const context = useContext(RsvpFormContext);
  if (context === undefined) {
    throw new Error('useRsvpForm must be used within a RsvpFormProvider');
  }
  return context;
};