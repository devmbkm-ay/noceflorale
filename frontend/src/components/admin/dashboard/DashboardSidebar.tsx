"use client";

import React from "react";
import Link from "next/link";
import {
  ImageIcon,
  Users,
  LayoutDashboard,
  ArrowLeft,
  FileText,
} from "lucide-react";

interface DashboardSidebarProps {
  user: { name?: string } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardSidebar({ user, activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <div className='w-64 bg-royal-600 text-white min-h-screen p-4'>
      <div className='mb-8'>
        <h2 className='text-xl font-playfair font-bold'>
          Tableau de Bord Admin
        </h2>
        <p className='text-sm text-royal-200'>Bienvenue, {user?.name}</p>
      </div>

      <nav className='space-y-2'>
        <button
          onClick={() => onTabChange("dashboard")}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left ${
            activeTab === "dashboard" ? "bg-royal-700" : "hover:bg-royal-500"
          }`}
        >
          <LayoutDashboard size={18} />
          Tableau de Bord
        </button>
        <button
          onClick={() => onTabChange("guests")}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left ${
            activeTab === "guests" ? "bg-royal-700" : "hover:bg-royal-500"
          }`}
        >
          <Users size={18} />
          Liste des Invités
        </button>
        <button
          onClick={() => onTabChange("export")}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left ${
            activeTab === "export" ? "bg-royal-700" : "hover:bg-royal-500"
          }`}
        >
          <FileText size={18} />
          Exporter les Données
        </button>
        <button
          onClick={() => onTabChange("content")}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left ${
            activeTab === "content" ? "bg-royal-700" : "hover:bg-royal-500"
          }`}
        >
          <ImageIcon size={18} />
          Gestion du Contenu
        </button>
      </nav>

      <div className='absolute bottom-8'>
        <Link
          href='/'
          className='flex items-center gap-2 text-royal-200 hover:text-white'
        >
          <ArrowLeft size={16} />
          Retour au Site Web
        </Link>
      </div>
    </div>
  );
}
