import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowDownUp, 
  ArrowDown, 
  ArrowUp, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  Mail 
} from "lucide-react";
import { ApolloError } from "@apollo/client";
import { Rsvp } from "@/graphql/rsvp";

interface GuestTableProps {
  guests: Rsvp[];
  isLoading: boolean;
  error: ApolloError | undefined;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewGuest: (guest: Rsvp) => void;
  onEditGuest: (guest: Rsvp) => void;
  onDeleteGuest: (guest: Rsvp) => void;
  onToggleAttendance: (guest: Rsvp) => void;
  onSendFeedback?: (guest: Rsvp) => void;
}

export function GuestTable({
  guests,
  isLoading,
  error,
  sortField,
  sortDirection,
  onSort,
  onViewGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleAttendance,
  onSendFeedback,
}: GuestTableProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowDownUp size={16} className='text-gray-400' />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp size={16} className='text-royal-600' />
      : <ArrowDown size={16} className='text-royal-600' />;
  };

  const getEventParticipationText = (eventParticipation: string) => {
    switch (eventParticipation) {
      case "both":
        return "Les deux événements";
      case "blessing_only":
        return "Cérémonie uniquement";
      case "evening_only":
        return "Réception uniquement";
      default:
        return "Aucun";
    }
  };

  if (isLoading && !guests.length) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin h-8 w-8 border-2 border-royal-600 rounded-full border-t-transparent mr-3'></div>
            <p>Chargement des invités...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center py-8'>
            <p className='text-red-500'>
              Erreur lors du chargement des données. Veuillez réessayer.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guests.length) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center py-8'>
            <p className='text-gray-500 italic'>
              Aucun invité trouvé pour les critères sélectionnés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mb-6'>
      <CardContent className='pt-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th 
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                  onClick={() => onSort("firstName")}
                >
                  <div className='flex items-center gap-2'>
                    Nom
                    {getSortIcon("firstName")}
                  </div>
                </th>
                <th 
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                  onClick={() => onSort("partnerFirstName")}
                >
                  <div className='flex items-center gap-2'>
                    Partenaire
                    {getSortIcon("partnerFirstName")}
                  </div>
                </th>
                <th 
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                  onClick={() => onSort("attending")}
                >
                  <div className='flex items-center gap-2'>
                    Statut
                    {getSortIcon("attending")}
                  </div>
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Événement
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {guests.map((guest) => (
                <tr key={guest.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {guest.firstName} {guest.lastName}
                    </div>
                    {guest.telephone && (
                      <div className='text-sm text-gray-500'>
                        {guest.telephone}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {guest.guestType === "couple" && guest.partnerFirstName && guest.partnerLastName
                        ? `${guest.partnerFirstName} ${guest.partnerLastName}`
                        : guest.guestType === "couple" 
                        ? "Partenaire non spécifié"
                        : "—"
                      }
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <button
                      onClick={() => onToggleAttendance(guest)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full flex items-center gap-1 transition-colors ${
                        guest.attending === "attending"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      title="Cliquer pour changer le statut"
                    >
                      <CheckCircle size={12} />
                      {guest.attending === "attending" ? "Présent" : "Absent"}
                    </button>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div>
                      <div className='font-medium text-gray-700'>
                        {guest.firstName}: {getEventParticipationText(guest.eventParticipation)}
                      </div>
                      {guest.guestType === "couple" && guest.partnerEventParticipation && (
                        <div className={`text-xs mt-1 ${
                          guest.eventParticipation !== guest.partnerEventParticipation 
                            ? 'text-orange-600 font-medium' 
                            : 'text-gray-500'
                        }`}>
                          {guest.partnerFirstName || 'Partenaire'}: {getEventParticipationText(guest.partnerEventParticipation)}
                          {guest.eventParticipation !== guest.partnerEventParticipation && (
                            <span className='ml-1 text-orange-500' title='Participations différentes'>⚠️</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div>
                      {guest.guestType === "single" ? "Seul" : "Couple"}
                      {guest.hasChildren && guest.children && guest.children.length > 0 && (
                        <div className='text-xs text-gray-400'>
                          + {guest.children.length} enfant{guest.children.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                    <button
                      onClick={() => onViewGuest(guest)}
                      className='text-royal-600 hover:text-royal-900'
                      title="Voir les détails"
                    >
                      <Eye size={16} className='inline' />
                    </button>
                    <button
                      onClick={() => onEditGuest(guest)}
                      className='text-blue-600 hover:text-blue-900'
                      title="Modifier l'invité"
                    >
                      <Edit size={16} className='inline' />
                    </button>
                    {onSendFeedback && (
                      <button
                        onClick={() => onSendFeedback(guest)}
                        className='text-green-600 hover:text-green-900'
                        title="Envoyer un message"
                      >
                        <Mail size={16} className='inline' />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteGuest(guest)}
                      className='text-red-600 hover:text-red-900'
                      title="Supprimer l'invité"
                    >
                      <Trash2 size={16} className='inline' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className='bg-gray-100'>
              <tr>
                <td
                  colSpan={4}
                  className='px-6 py-3 text-right font-semibold text-gray-700'
                >
                  Total des invités:
                </td>
                <td className='px-6 py-3 font-bold text-gray-900'>
                  {guests.reduce((total, guest) => {
                    if (guest.attending === "attending") {
                      return total + (guest.guestType === "single" ? 1 : 2);
                    }
                    return total;
                  }, 0)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
