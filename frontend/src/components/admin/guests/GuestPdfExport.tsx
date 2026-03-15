"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { exportToPdf } from "@/utils/exportImport";
import { Rsvp } from "@/graphql/rsvp";

interface GuestPdfExportProps {
  guests: Rsvp[];
  className?: string;
}

export function GuestPdfExport({ guests, className }: GuestPdfExportProps) {
  const handlePdfExport = () => {
    // Export with the default admin table format fields
    const defaultFields = [
      "name",  // This will be formatted as firstName + lastName
      "partnerFullName", 
      "attending",
      "eventParticipation",
      "guestType",
      "children",
      "totalGuests"
    ];
    
    exportToPdf(guests, defaultFields);
  };

  return (
    <Button
      onClick={handlePdfExport}
      variant="outline"
      className={`border-royal-600 text-royal-600 hover:bg-royal-50 ${className || ""}`}
      disabled={!guests.length}
    >
      <FileText size={16} className="mr-2" />
      Exporter PDF
    </Button>
  );
}
