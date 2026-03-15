import { toast } from "sonner";
import React from "react";

/**
 * Checks if an error is a duplicate email error.
 */
export const isDuplicateEmailError = (error: Error | unknown): boolean => {
  const errorMessage = (error as Error)?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("email already exists") ||
    errorMessage.includes("an rsvp with this email already exists") ||
    errorMessage.includes("duplicate") ||
    (errorMessage.includes("email") && errorMessage.includes("exists"))
  );
};
// Create a separate component for the toast description
const ToastDescription: React.FC<{ email: string }> = ({ email }) => (
  <div className='space-y-2'>
    <p>
      L&apos;adresse email <strong className='text-amber-200'>{email}</strong> a
      déjà été utilisée pour un RSVP.
    </p>
    <p className='text-sm'>
      Pour modifier votre réponse existante, veuillez contacter les mariés:
    </p>
    <a
      href={`mailto:floralenoce@gmail.com?subject=Modification%20de%20RSVP&body=Bonjour,%0A%0AJe%20souhaite%20modifier%20ma%20réponse%20RSVP%20pour%20votre%20mariage.%0A%0AMon%20email%20est:%20${encodeURIComponent(
        email
      )}`}
      className='text-royal-400 hover:text-royal-300 underline block mt-2'
      target='_blank'
      rel='noopener noreferrer'
    >
      floralenoce@gmail.com
    </a>
  </div>
);

/**
 * Handles duplicate email error with a user-friendly toast message.
 */
export const handleDuplicateEmailError = (
  email: string,
  form: {
    setError: (
      field: string,
      options: { type: string; message: string }
    ) => void;
  }
) => {
  // Set error on the email field
  form.setError("primaryGuest.email", {
    type: "manual",
    message: "Cette adresse email a déjà été utilisée pour un RSVP",
  });

  // Show a user-friendly toast with contact information
  toast.error("Email déjà utilisé", {
    description: <ToastDescription email={email} />,
    duration: 10000, // Show for longer as this is important information
    icon: "🔄",
  });

  // Scroll to email field for better visibility
  setTimeout(() => {
    document.getElementById("primary-guest-email")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
};
