"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_RSVP_STATS, RsvpStats } from "@/graphql/rsvp";
import {
  Users,
  CheckCircle,
  Calendar,
  ImageIcon,
  ArrowRight,
  LayoutDashboard,
  Mail,
  FileText,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export const SimpleAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Use the same GraphQL query as in the FullAdminDashboard
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery<{ getRsvpStats: RsvpStats }>(GET_RSVP_STATS);
  
  // Show welcome notification for admin after login
  useEffect(() => {
    // Only show welcome if user just logged in and it's not a page refresh
    const justLoggedIn = searchParams?.get('welcome') === 'true' || 
                        window.sessionStorage.getItem('admin_welcome_shown') !== 'true';
    
    if (user && justLoggedIn) {
      // Set a small delay to ensure the dashboard has loaded
      const timer = setTimeout(() => {
        toast.success(`🎉 Bienvenue, ${user.name}!`, {
          description: 'Vous êtes maintenant connecté(e) au tableau de bord admin.',
          duration: 4000,
          className: 'admin-welcome-toast'
        });
        
        // Mark welcome as shown for this session
        window.sessionStorage.setItem('admin_welcome_shown', 'true');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, searchParams]);

  // Wedding date is August 29, 2025
  const weddingDate = new Date("2025-08-29");
  const today = new Date();
  const daysRemaining = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Use a query to get gallery images count (mocked for now)
  const galleryImagesCount = 87;

  // Get actual stats or use empty stats while loading
  const stats = statsData?.getRsvpStats || {
    totalGuests: 0,
    attending: 0,
    notAttending: 0,
    ceremonyOnly: 0,
    receptionOnly: 0,
    both: 0,
    totalAdults: 0,
    totalChildren: 0,
  };

  // Calculate attendance percentage
  const maxCapacity = 340;
  const attendingCount = stats.totalGuests || 0;
  const attendancePercentage = maxCapacity > 0 
    ? Math.round((attendingCount / maxCapacity) * 100) 
    : 0;

  return (
    <div className='container py-10'>
      <h1 className='text-3xl font-bold mb-2'>
        Tableau de bord administrateur
      </h1>
      <p className='text-gray-500 mb-6'>
        Bienvenue sur le tableau de bord administrateur de Noce Florale
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        <StatsCard
          title="Nombre total d'invités"
          value={stats.totalGuests}
          subtitle={`${stats.notAttending} refusés`}
          icon={Users}
          iconColor='text-blue-500'
          isLoading={statsLoading}
          hasError={!!statsError}
        />

        <StatsCard
          title='Réponses RSVP'
          value={`${attendancePercentage}%`}
          subtitle={`${stats.totalGuests || 0} sur 340 (capacité maximale)`}
          icon={CheckCircle}
          iconColor='text-green-500'
          isLoading={statsLoading}
          hasError={!!statsError}
        />

        <StatsCard
          title='Jours restants'
          value={daysRemaining}
          subtitle={`Mariage le ${weddingDate.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
          icon={Calendar}
          iconColor='text-purple-500'
        />

        <StatsCard
          title='Photos de galerie'
          value={galleryImagesCount}
          subtitle='Photos ajoutées à la galerie'
          icon={ImageIcon}
          iconColor='text-pink-500'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Users className='mr-2 h-5 w-5' />
              Gestion des invités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Voir et gérer la liste des invités et leurs réponses RSVP
            </p>
            <Link href='/admin/guests'>
              <Button className='w-full'>
                Gérer les invités
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Mail className='mr-2 h-5 w-5' />
              Réponses RSVP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Consultez et gérez toutes les réponses RSVP reçues
            </p>
            <Link href='/admin/rsvp'>
              <Button className='w-full'>
                Voir les RSVP
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <ImageIcon className='mr-2 h-5 w-5' />
              Gestionnaire de galerie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Ajoutez et organisez les photos pour votre galerie de mariage
            </p>
            <Link href='/admin/gallery-manager'>
              <Button className='w-full'>
                Gérer la galerie
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Calendar className='mr-2 h-5 w-5' />
              Programme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Gérez le programme de votre journée de mariage
            </p>
            <Link href='/admin/schedule'>
              <Button className='w-full'>
                Gérer le programme
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FileText className='mr-2 h-5 w-5' />
              Pages du site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Modifiez et gérez le contenu des pages de votre site
            </p>
            <Link href='/admin/pages'>
              <Button className='w-full'>
                Gérer les pages
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <LayoutDashboard className='mr-2 h-5 w-5' />
              Vue complète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Accédez au tableau de bord complet avec toutes les fonctionnalités
            </p>
            <Link href='/admin?view=full'>
              <Button className='w-full' variant='outline'>
                Tableau complet
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
