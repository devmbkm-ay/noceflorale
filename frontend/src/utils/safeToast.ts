// Create or update the safeToast utility
import { toast as sonnerToast, ExternalToast } from "sonner";
import { useEffect, useCallback } from "react";

// Safe toast functions that prevent React render cycle errors
const createSafeToast = (toastFn: (message: string, options?: ExternalToast) => any) => {
  return (message: string, options?: ExternalToast) => {
    // Use setTimeout to ensure the toast is called outside of React's render cycle
    setTimeout(() => {
      toastFn(message, options);
    }, 0);
  };
};

// Named export (what your components are trying to import)
export const toast = {
  success: createSafeToast(sonnerToast.success),
  error: createSafeToast(sonnerToast.error),
  info: createSafeToast(sonnerToast.info),
  warning: createSafeToast(sonnerToast.warning),
  loading: createSafeToast(sonnerToast.loading),
  
  // Direct versions for when you need immediate execution (use carefully)
  direct: {
    success: sonnerToast.success,
    error: sonnerToast.error,
    info: sonnerToast.info,
    warning: sonnerToast.warning,
    loading: sonnerToast.loading,
  }
};

// Hook to create safe toast functions with proper cleanup
export const useSafeToast = () => {
  const safeToast = useCallback(() => ({
    success: (message: string, options?: ExternalToast) => {
      requestAnimationFrame(() => {
        sonnerToast.success(message, options);
      });
    },
    error: (message: string, options?: ExternalToast) => {
      requestAnimationFrame(() => {
        sonnerToast.error(message, options);
      });
    },
    info: (message: string, options?: ExternalToast) => {
      requestAnimationFrame(() => {
        sonnerToast.info(message, options);
      });
    },
    warning: (message: string, options?: ExternalToast) => {
      requestAnimationFrame(() => {
        sonnerToast.warning(message, options);
      });
    },
    loading: (message: string, options?: ExternalToast) => {
      requestAnimationFrame(() => {
        sonnerToast.loading(message, options);
      });
    },
  }), []);

  return safeToast;
};

// Add the missing useToastCleanup hook
export const useToastCleanup = () => {
  useEffect(() => {
    return () => {
      // Dismiss all toasts when component unmounts
      setTimeout(() => {
        sonnerToast.dismiss();
      }, 0);
    };
  }, []);
};

// Default export for backward compatibility
export default toast;
