import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ConfirmationSummaryProps {
  formData: {
    invitationCode: string;
    guests: Array<{
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      dietaryRestrictions?: string;
      isAttending: boolean;
    }>;
    events: {
      ceremony: {
        isAttending: boolean;
        attendeeIds?: number[];
      };
      reception: {
        isAttending: boolean;
        attendeeIds?: number[];
      };
    };
    additionalNotes?: string;
  };
}

export const ConfirmationSummary: React.FC<ConfirmationSummaryProps> = ({ formData }) => {
  const attendingGuests = formData.guests.filter(guest => guest.isAttending);
  const nonAttendingGuests = formData.guests.filter(guest => !guest.isAttending);
  
  const getAttendeeNames = (eventType: 'ceremony' | 'reception') => {
    const attendeeIds = formData.events[eventType].attendeeIds || [];
    return attendeeIds.map(id => {
      const guest = formData.guests[id];
      return guest ? `${guest.firstName} ${guest.lastName}` : '';
    }).filter(Boolean);
  };

  const ceremonyAttendees = getAttendeeNames('ceremony');
  const receptionAttendees = getAttendeeNames('reception');
  
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-6">
        <h3 className="text-green-800 font-medium text-lg mb-1">
          Review Your RSVP
        </h3>
        <p className="text-green-700 text-sm">
          Please review your information below before submitting your RSVP.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Guest attendance summary */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium border-b pb-2">Guest Information</h4>
          
          {attendingGuests.length > 0 && (
            <div>
              <h5 className="font-medium flex items-center text-green-700 mb-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Attending
              </h5>
              <ul className="list-disc pl-6 space-y-2">
                {attendingGuests.map((guest, index) => (
                  <li key={index}>
                    <span className="font-medium">{guest.firstName} {guest.lastName}</span>
                    {guest.email && <div className="text-sm text-gray-600">Email: {guest.email}</div>}
                    {guest.phone && <div className="text-sm text-gray-600">Phone: {guest.phone}</div>}
                    {guest.dietaryRestrictions && (
                      <div className="text-sm text-gray-600">
                        Dietary restrictions: {guest.dietaryRestrictions}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {nonAttendingGuests.length > 0 && (
            <div>
              <h5 className="font-medium flex items-center text-gray-500 mb-2">
                <XCircle className="h-4 w-4 mr-2" />
                Not Attending
              </h5>
              <ul className="list-disc pl-6 text-gray-600">
                {nonAttendingGuests.map((guest, index) => (
                  <li key={index}>{guest.firstName} {guest.lastName}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Events summary */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium border-b pb-2">Events</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h5 className="font-medium mb-2">Wedding Ceremony</h5>
              {ceremonyAttendees.length > 0 ? (
                <div>
                  <p className="text-green-700 font-medium mb-1 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Attending
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {ceremonyAttendees.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> No one attending
                </p>
              )}
            </div>
            
            <div className="border rounded-md p-4">
              <h5 className="font-medium mb-2">Wedding Reception</h5>
              {receptionAttendees.length > 0 ? (
                <div>
                  <p className="text-green-700 font-medium mb-1 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Attending
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {receptionAttendees.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> No one attending
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional notes */}
        {formData.additionalNotes && (
          <div className="space-y-2">
            <h4 className="text-lg font-medium border-b pb-2">Additional Notes</h4>
            <p className="text-gray-700">{formData.additionalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};