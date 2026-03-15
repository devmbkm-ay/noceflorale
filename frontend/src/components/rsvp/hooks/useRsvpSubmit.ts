import { FieldPath, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ApolloError, FetchResult, MutationFunctionOptions, OperationVariables } from "@apollo/client";
import {
  isDuplicateEmailError,
  handleDuplicateEmailError,
} from "@/utils/rsvpErrorHandling";
import { type RsvpFormData } from "../validation";
import { validateAndPrepareGuestInput } from "../utils/formUtils";
import { PrimaryGuestInput } from "@/graphql/rsvp";

interface UseRsvpSubmitProps {
  form: UseFormReturn<RsvpFormData>;
  setSubmitting: (submitting: boolean) => void;
  setFormSubmitted: (submitted: boolean) => void;
  attendanceErrorShown: boolean;
  createRsvp: (options?: MutationFunctionOptions<any, OperationVariables>) => Promise<FetchResult<any>>;
}

export const useRsvpSubmit = ({
  form,
  setSubmitting,
  setFormSubmitted,
  attendanceErrorShown,
  createRsvp,
}: UseRsvpSubmitProps) => {

  const onSubmit = async (data: RsvpFormData) => {
    try {
      console.log("🚀 Form submission started", new Date().toISOString());
      console.log("📝 Form data:", JSON.stringify(data, null, 2));
      setSubmitting(true);
      form.setValue("isSubmitting", true);

      const guestInput = validateAndPrepareGuestInput(data, attendanceErrorShown);

      console.log(
        "📋 Prepared guest input:",
        JSON.stringify(guestInput, null, 2)
      );

      const result = await createRsvp({
        variables: { guest: guestInput },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      if (result.errors) {
        console.error("❌ GraphQL errors in result:", result.errors);
      }

      if (!result.errors) {
        console.log("✅ RSVP submission successful:", result);
        toast.success("RSVP soumis avec succès!", {
          description: `Merci, ${data.primaryGuest.firstName} ${data.primaryGuest.lastName}. Nous avons bien reçu votre réponse.`,
        });
        setFormSubmitted(true);
      } else {
        console.error("❌ GraphQL errors present, not considering as success:", result.errors);
        throw new Error("GraphQL errors present");
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
      if (error instanceof ApolloError) {
        if (error.networkError) {
          if ('statusCode' in error.networkError && error.networkError.statusCode === 500) {
            toast.error("Erreur du Serveur", {
              description: "Le serveur rencontre des difficultés. Veuillez réessayer dans quelques minutes ou nous contacter si le problème persiste.",
            });
            return;
          }
          if (error.networkError.message.includes('fetch')) {
            toast.error("Erreur de Connexion", {
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.",
            });
            return;
          }
        }
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
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const duplicateEmailError = error.graphQLErrors.find(
            (err) =>
              err.message.includes("email already exists") ||
              err.message.includes("An RSVP with this email already exists") ||
              err.message.includes("duplicate") ||
              (err.message.toLowerCase().includes("email") &&
                err.message.toLowerCase().includes("exists"))
          );
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
          if (refererError) {
            toast.error("Erreur de sécurité", {
              description:
                "Pour des raisons de sécurité, les soumissions ne sont acceptées que depuis notre site officiel. Veuillez réessayer en utilisant le formulaire sur notre site.",
            });
            console.error("Referer validation error:", refererError);
            return;
          }
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
          const firstError = error.graphQLErrors[0];
          toast.error("Erreur GraphQL", {
            description:
              firstError.message ||
              "Une erreur s'est produite lors de l'envoi.",
          });
          return;
        }
        if (error.networkError) {
          toast.error("Erreur de Réseau", {
            description:
              "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.",
          });
          return;
        }
        toast.error("Erreur Apollo", {
          description:
            error.message || "Une erreur s'est produite lors de l'envoi.",
        });
        return;
      }
      if (error instanceof Error) {
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
      toast.error("Échec de l'envoi du RSVP", {
        description:
          "Une erreur inconnue s'est produite. Veuillez réessayer plus tard.",
      });
    } finally {
      setSubmitting(false);
      form.setValue("isSubmitting", false);
    }
  };

  return { onSubmit };
};
