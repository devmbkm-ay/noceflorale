"use client";

import React, { useState, useEffect } from "react";
import { SimpleAdminDashboard } from "@/components/admin/dashboard/SimpleAdminDashboard";
import { FullAdminDashboard } from "@/components/admin/dashboard/FullAdminDashboard";

export default function AdminDashboard() {
  // Decide which dashboard to render based on the URL path or a context value
  const [activeView, setActiveView] = useState<"simple" | "full">("simple");
  // const { user } = useAuth();

  // Use this effect to determine which view to show based on URL params or user preferences
  useEffect(() => {
    // Check URL parameters for view preference
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");

    if (viewParam === "full") {
      setActiveView("full");
    }
  }, []);

  return (
    <>
      {activeView === "simple" ? (
        <SimpleAdminDashboard />
      ) : (
        <FullAdminDashboard />
      )}
    </>
  );
}

