"use client";

import React, { useState, useEffect } from "react";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

/**
 * AdminClientLayout provides the client-side layout for admin pages
 * Includes:
 * - AdminAuthGuard for authentication protection
 * - AdminSidebar for navigation
 * - Responsive layout structure
 * - Toast notifications
 */
export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AdminAuthGuard>
      <div className='relative flex h-screen overflow-hidden bg-gray-50'>
        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Admin Sidebar */}
        <div className={cn(
          "transition-transform duration-300 ease-in-out z-30",
          isMobile 
            ? sidebarOpen 
              ? "translate-x-0 fixed inset-y-0 left-0" 
              : "-translate-x-full fixed inset-y-0 left-0"
            : "relative"
        )}>
          <AdminSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Mobile header with menu button */}
          {isMobile && (
            <div className='flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSidebarOpen(true)}
                className='p-2'
              >
                <Menu className='h-5 w-5' />
              </Button>
              <h1 className='text-lg font-semibold text-gray-900'>
                Admin Dashboard
              </h1>
              <div className='w-9' /> {/* Spacer for centering */}
            </div>
          )}

          {/* Main content with scrolling */}
          <main className='flex-1 overflow-y-auto p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>
              {/* Welcome header - hidden on mobile when we have the mobile header */}
              {!isMobile && (
                <div className='mb-8'>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Bienvenue, {user?.name || "Admin"}
                  </h1>
                  <p className='text-gray-600 mt-1'>
                    Gérez votre site de mariage depuis ce tableau de bord
                  </p>
                </div>
              )}

              {/* Mobile welcome section */}
              {isMobile && (
                <div className='mb-6'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    Bienvenue, {user?.name || "Admin"}
                  </h2>
                  <p className='text-gray-600 mt-1 text-sm'>
                    Gérez votre site de mariage
                  </p>
                </div>
              )}

              {/* Page content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
