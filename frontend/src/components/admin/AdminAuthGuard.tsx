"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

interface AdminAuthGuardProps {
  children: ReactNode;
}

/**
 * AdminAuthGuard component that protects admin routes
 * It checks if the current user is authenticated and has admin privileges
 * If not, it redirects to the login page with a returnUrl
 * Also wraps the children with ApolloProvider to ensure GraphQL functionality
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAdmin, isLoading, isAuthInitialized } = useAuth();

  useEffect(() => {
    // Only redirect after auth is initialized and if user is not an admin
    if (isAuthInitialized && !isLoading && (!user || !isAdmin)) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname;
      console.log('🔐 Redirecting to login for admin access:', { currentPath, user: user?.name, isAdmin });
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [user, isAdmin, isLoading, isAuthInitialized, router]);
  
  // Log successful admin access
  useEffect(() => {
    if (isAuthInitialized && user && isAdmin) {
      console.log('✅ Admin access granted:', { 
        user: user.name, 
        email: user.email, 
        path: window.location.pathname 
      });
    }
  }, [user, isAdmin, isAuthInitialized]);
  
  // Show loading state while checking authentication
  if (isLoading || !isAuthInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Vérification de l&apos;accès...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Accès Refusé</h1>
          <p className="mt-2 text-gray-600">
            Vous n&apos;avez pas la permission d&apos;accéder à cette page.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-royal-600 text-white rounded-md"
          >
            Retour à l&apos;Accueil
          </button>
        </div>
      </div>
    );
  }
  
  // User is authenticated and is admin, wrap children with ApolloProvider
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
