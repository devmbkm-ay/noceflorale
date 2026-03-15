import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, Mail } from "lucide-react";
import { RsvpStats } from "@/graphql/rsvp";

interface GuestStatsCardsProps {
  stats: RsvpStats;
  isLoading?: boolean;
}

export function GuestStatsCards({ stats, isLoading }: GuestStatsCardsProps) {
  const attendanceRate = stats.totalGuests > 0 
    ? Math.round((stats.attending / stats.totalGuests) * 100) 
    : 0;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-medium text-gray-700'>
            Total des invités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-3xl font-bold'>
              {stats.totalAdults + stats.totalChildren}
            </p>
            <Users className='h-8 w-8 text-purple-500' />
          </div>
          {isLoading ? (
            <span className='text-xs text-gray-400'>Chargement...</span>
          ) : (
            <p className='text-sm text-gray-500 mt-2'>
              {stats.totalAdults} adultes, {stats.totalChildren} enfants
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-medium text-gray-700'>
            Taux de réponse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-3xl font-bold'>{attendanceRate}%</p>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </div>
          {isLoading ? (
            <span className='text-xs text-gray-400'>Chargement...</span>
          ) : (
            <p className='text-sm text-gray-500 mt-2'>
              {stats.attending} confirmés sur {stats.totalGuests}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-medium text-gray-700'>
            Événements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-3xl font-bold'>{stats.both}</p>
            <Calendar className='h-8 w-8 text-blue-500' />
          </div>
          {isLoading ? (
            <span className='text-xs text-gray-400'>Chargement...</span>
          ) : (
            <p className='text-sm text-gray-500 mt-2'>
              Cérémonie et réception
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-medium text-gray-700'>
            RSVP en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-3xl font-bold text-orange-600'>
              {Math.max(0, (stats.maxCapacity || 340) - stats.totalGuests)}
            </p>
            <Mail className='h-8 w-8 text-orange-500' />
          </div>
          {isLoading ? (
            <span className='text-xs text-gray-400'>Chargement...</span>
          ) : (
            <p className='text-sm text-gray-500 mt-2'>
              Invitations restantes
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
