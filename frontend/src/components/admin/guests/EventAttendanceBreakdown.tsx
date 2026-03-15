import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, PartyPopper, Heart, Users, AlertTriangle } from 'lucide-react';
import { Rsvp } from '@/graphql/rsvp';

interface EventAttendanceBreakdownProps {
  guests: Rsvp[];
}

export function EventAttendanceBreakdown({ guests }: EventAttendanceBreakdownProps) {
  const calculateEventAttendance = () => {
    let ceremonyTotal = 0;
    let receptionTotal = 0;
    let bothTotal = 0;
    let differentPreferencesCount = 0;
    const differentPreferencesCouples: Array<{
      primaryGuest: string;
      primaryPreference: string;
      partner: string;
      partnerPreference: string;
    }> = [];

    guests.forEach((guest) => {
      if (guest.attending === 'attending') {
        const primaryParticipation = guest.eventParticipation;
        const partnerParticipation = guest.partnerEventParticipation;

        // Count primary guest
        if (primaryParticipation === 'both') bothTotal++;
        else if (primaryParticipation === 'blessing_only') ceremonyTotal++;
        else if (primaryParticipation === 'evening_only') receptionTotal++;

        // Count partner if it's a couple
        if (guest.guestType === 'couple' && partnerParticipation) {
          if (partnerParticipation === 'both') bothTotal++;
          else if (partnerParticipation === 'blessing_only') ceremonyTotal++;
          else if (partnerParticipation === 'evening_only') receptionTotal++;

          // Check for different preferences
          if (primaryParticipation !== partnerParticipation) {
            differentPreferencesCount++;
            differentPreferencesCouples.push({
              primaryGuest: `${guest.firstName} ${guest.lastName}`,
              primaryPreference: getEventParticipationText(primaryParticipation),
              partner: guest.partnerFirstName ? `${guest.partnerFirstName} ${guest.partnerLastName || ''}`.trim() : 'Partenaire',
              partnerPreference: getEventParticipationText(partnerParticipation),
            });
          }
        }
      }
    });

    return {
      ceremonyTotal,
      receptionTotal,
      bothTotal,
      differentPreferencesCount,
      differentPreferencesCouples,
    };
  };

  const getEventParticipationText = (participation: string) => {
    switch (participation) {
      case 'both': return 'Les deux événements';
      case 'blessing_only': return 'Cérémonie uniquement';
      case 'evening_only': return 'Réception uniquement';
      default: return 'Aucun';
    }
  };

  const stats = calculateEventAttendance();

  return (
    <div className="space-y-6">
      {/* Event Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cérémonie</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.ceremonyTotal + stats.bothTotal}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.ceremonyTotal} cérémonie seulement + {stats.bothTotal} les deux
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <PartyPopper className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réception</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.receptionTotal + stats.bothTotal}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.receptionTotal} réception seulement + {stats.bothTotal} les deux
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Journée complète</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bothTotal}</p>
                <p className="text-xs text-gray-500">Cérémonie + Réception</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Different Preferences Alert */}
      {stats.differentPreferencesCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Couples avec préférences différentes
              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-sm font-bold">
                {stats.differentPreferencesCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 mb-4">
              Les couples suivants ont choisi de participer à des événements différents :
            </p>
            <div className="space-y-3">
              {stats.differentPreferencesCouples.map((couple, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{couple.primaryGuest}:</span>
                      <span className="ml-2 text-gray-600">{couple.primaryPreference}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{couple.partner}:</span>
                      <span className="ml-2 text-gray-600">{couple.partnerPreference}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-100 rounded-lg">
              <p className="text-xs text-orange-700">
                💡 <strong>Conseil :</strong> Assurez-vous de prévoir des places séparées pour ces couples selon leurs préférences de participation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition détaillée des participations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.ceremonyTotal}</div>
                <div className="text-sm text-blue-700">Cérémonie uniquement</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.receptionTotal}</div>
                <div className="text-sm text-purple-700">Réception uniquement</div>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{stats.bothTotal}</div>
                <div className="text-sm text-pink-700">Les deux événements</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">
                <p><strong>Total cérémonie :</strong> {stats.ceremonyTotal + stats.bothTotal} personnes</p>
                <p><strong>Total réception :</strong> {stats.receptionTotal + stats.bothTotal} personnes</p>
                {stats.differentPreferencesCount > 0 && (
                  <p className="text-orange-600 font-medium">
                    <strong>Couples avec préférences différentes :</strong> {stats.differentPreferencesCount}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
