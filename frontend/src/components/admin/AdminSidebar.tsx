"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Image,
  FileText,
  Mail,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen = true, 
  onClose, 
  isMobile = false 
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems: NavItem[] = [
    {
      name: "Tableau de bord",
      href: "/admin",
      icon: <LayoutDashboard className='h-5 w-5' />,
      section: "general",
    },
    {
      name: "Gestionnaire de galerie",
      href: "/admin/gallery-manager",
      icon: <Image className='h-5 w-5' />,
      section: "content",
    },
    {
      name: "Réponses RSVP",
      href: "/admin/rsvp",
      icon: <Mail className='h-5 w-5' />,
      section: "content",
    },
    {
      name: "Détails du mariage",
      href: "/admin/wedding-details",
      icon: <Heart className='h-5 w-5' />,
      section: "content",
    },
    {
      name: "Pages",
      href: "/admin/pages",
      icon: <FileText className='h-5 w-5' />,
      section: "content",
    },
    {
      name: "Liste des invités",
      href: "/admin/guests",
      icon: <Users className='h-5 w-5' />,
      section: "management",
    },
    {
      name: "Programme",
      href: "/admin/schedule",
      icon: <Calendar className='h-5 w-5' />,
      section: "management",
    },
    {
      name: "Paramètres",
      href: "/admin/settings",
      icon: <Settings className='h-5 w-5' />,
      section: "system",
    },
  ];

  // Group navigation items by section
  const sections = navigationItems.reduce(
    (acc: Record<string, NavItem[]>, item) => {
      const section = item.section || "other";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    },
    {}
  );

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isMobile ? "w-64" : (collapsed ? "w-16" : "w-64")
      )}
    >
      {/* Sidebar Header */}
      <div className='p-4 flex items-center justify-between'>
        {(!collapsed || isMobile) && (
          <div className='flex items-center space-x-2'>
            <span className='font-bold text-lg'>Panneau d&#39;admin</span>
          </div>
        )}
        {isMobile ? (
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='p-1'
          >
            <X className='h-5 w-5' />
          </Button>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className='h-5 w-5' />
            ) : (
              <ChevronLeft className='h-5 w-5' />
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* Admin Profile */}
      <div className={cn("p-4", (collapsed && !isMobile) ? "text-center" : "")}>
        <Avatar className={cn("h-10 w-10", (collapsed && !isMobile) ? "mx-auto" : "")}>
          <AvatarImage src='/admin-avatar.svg' alt='Admin' />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        {(!collapsed || isMobile) && (
          <div className='mt-2'>
            <p className='text-sm font-medium'>{user?.name || "Admin User"}</p>
            <p className='text-xs text-gray-500'>
              {user?.email || "admin@noceflorale.com"}
            </p>
          </div>
        )}
      </div>

<Separator />

      {/* Navigation Items */}
      <nav className='flex-1 overflow-y-auto p-2'>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className='mb-6'>
            {(!collapsed || isMobile) && (
              <p className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </p>
            )}

            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                    (collapsed && !isMobile) ? "justify-center" : "space-x-3"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <div className={isActive ? "text-blue-700" : "text-gray-500"}>
                    {item.icon}
                  </div>
                  {(!collapsed || isMobile) && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <Separator />

      {/* Logout Button */}
      <div className='p-4'>
        <Button
          variant='ghost'
          className={cn(
            "w-full flex items-center text-red-600 hover:bg-red-50 hover:text-red-700",
            (collapsed && !isMobile) ? "justify-center p-2" : "justify-start px-3"
          )}
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          <LogOut className='h-5 w-5' />
          {(!collapsed || isMobile) && <span className='ml-2'>Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};
