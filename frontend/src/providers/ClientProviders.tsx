"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, ApolloWrapper } from "@/providers";
import { Toaster } from "sonner";

// Error boundary for Toaster
class ToasterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Toaster error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't render Toaster if it has errors
    }
    return this.props.children;
  }
}

export function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider defaultTheme='system'>
      <ApolloWrapper>
        <AuthProvider>
          {children}
          <ToasterErrorBoundary>
            <Toaster
              position='top-right'
              closeButton
              richColors
              expand={false}
              visibleToasts={5}
              // Prevent auto-dismiss during render
              duration={4000}
              // Add offset to prevent layout shifts
              offset={16}
            />
          </ToasterErrorBoundary>
        </AuthProvider>
      </ApolloWrapper>
    </ThemeProvider>
  );
}
export default ClientProviders;
