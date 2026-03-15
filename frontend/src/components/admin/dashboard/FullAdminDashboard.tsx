"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToastCleanup } from "@/utils/safeToast";
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardOverview } from "./DashboardOverview";
import { GuestsTab } from "./GuestsTab";
import { ExportTab } from "./ExportTab";
import { ContentTab } from "./ContentTab";

export function FullAdminDashboard() {
  const { user } = useAuth();
  
  // Add toast cleanup to prevent memory leaks and React state update errors
  useToastCleanup();

  // Use custom dashboard state hook
  const dashboardState = useDashboardState();

  const renderTabContent = () => {
    switch (dashboardState.activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            stats={dashboardState.stats}
            statsLoading={dashboardState.statsLoading}
            statsError={dashboardState.statsError}
          />
        );
      case "guests":
        return <GuestsTab />;
      case "export":
        return <ExportTab />;
      case "content":
        return <ContentTab />;
      default:
        return (
          <DashboardOverview
            stats={dashboardState.stats}
            statsLoading={dashboardState.statsLoading}
            statsError={dashboardState.statsError}
          />
        );
    }
  };

  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar
        user={user}
        activeTab={dashboardState.activeTab}
        onTabChange={dashboardState.setActiveTab}
      />
      <div className='flex-1 p-6'>
        {renderTabContent()}
      </div>
    </div>
  );
}
