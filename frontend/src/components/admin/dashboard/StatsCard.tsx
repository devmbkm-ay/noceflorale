"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-500",
  isLoading = false,
  hasError = false,
  errorMessage = "Erreur lors du chargement des données",
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        ) : hasError ? (
          <p className="text-sm text-red-500">{errorMessage}</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{value}</p>
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
