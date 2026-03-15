"use client";

import { useEffect, useState } from "react";import { useTheme as useNextTheme } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  // Use next-themes for theme management
  const { theme, setTheme } = useNextTheme();

  // Only render children after component is mounted to avoid hydration mismatch
  useEffect(() => {
    if (!theme && defaultTheme) {
      setTheme(defaultTheme);
    }
    setMounted(true);
  }, [theme, defaultTheme, setTheme]);

  if (!mounted) {
    // Return a simple version during SSR to prevent hydration mismatch
    return <>{children}</>;
  }

  return (
    <>
      {children}
    </>
  );

}