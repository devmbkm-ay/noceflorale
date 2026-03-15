"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToastCleanup } from "@/utils/safeToast";
import { GuestPageContent } from "@/components/admin/guests/GuestPageContent";

export default function GuestsPage() {
  // Add toast cleanup to prevent memory leaks
  useToastCleanup();

  return (
    <div className='container mx-auto p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-royal-800'>
            Gestion des invités
          </h1>
          <p className='text-gray-500'>
            Gérez vos invités de mariage et les RSVP
          </p>
        </div>
        <Link
          href='/admin'
          className='flex items-center text-royal-600 hover:text-royal-800'
        >
          <ArrowLeft size={16} className='mr-2' />
          Retour au tableau de bord
        </Link>
      </div>

      <GuestPageContent />
    </div>
  );
}
