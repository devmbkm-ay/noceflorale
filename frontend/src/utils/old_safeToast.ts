import { toast } from "sonner";
import { useEffect } from "react";

// Define proper types instead of using 'any'
type ToastOptions = {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
};

type ToastFunction = (message: string, options?: ToastOptions) => void;

interface SafeToast {
  success: ToastFunction;
  error: ToastFunction;
  info: ToastFunction;
  warning: ToastFunction;
}

// Safe toast wrapper that handles potential errors
export const safeToast: SafeToast = {
  success: (message: string, options?: ToastOptions) => {
    try {
      toast.success(message, options);
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console log if toast fails
      console.log("SUCCESS:", message);
    }
  },

  error: (message: string, options?: ToastOptions) => {
    try {
      toast.error(message, options);
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console log if toast fails
      console.error("ERROR:", message);
    }
  },

  info: (message: string, options?: ToastOptions) => {
    try {
      toast.info(message, options);
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console log if toast fails
      console.info("INFO:", message);
    }
  },

  warning: (message: string, options?: ToastOptions) => {
    try {
      toast.warning(message, options);
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console log if toast fails
      console.warn("WARNING:", message);
    }
  },
};

/**
 * A hook that cleans up all active toasts when the component unmounts
 * to prevent memory leaks and React state update errors.
 *
 * This should be called at the top level of components that use toasts.
 */
export const useToastCleanup = () => {
  useEffect(() => {
    // Return a cleanup function that will be called when the component unmounts
    return () => {
      try {
        // Dismiss all toasts when the component unmounts
        toast.dismiss();
      } catch (error) {
        console.error("Failed to clean up toasts:", error);
      }
    };
  }, []);
};

// Default export
export default safeToast;
