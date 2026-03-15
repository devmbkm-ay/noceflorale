import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarClock } from 'lucide-react';

interface EventSelectionProps {
  form: UseFormReturn<{
    events: {
      ceremony: {
        attendeeIds: number[];
        isAttending: boolean;
      };
      reception: {
        attendeeIds: number[];
        isAttending: boolean;
      };
    };
    additionalNotes: string;
  }>;
  guestsAttending: Array<{
    firstName: string;
    lastName: string;
    isAttending: boolean;
  }>;
}
type EventType = 'ceremony' | 'reception';

export const EventSelection: React.FC<EventSelectionProps> = ({ form, guestsAttending }) => {
  const [ceremonyAttendees, setCeremonyAttendees] = useState<number[]>([]);
  const [receptionAttendees, setReceptionAttendees] = useState<number[]>([]);
  
  const eventsData = [
    { 
      id: 'ceremony',
      name: 'Wedding Ceremony', 
      date: 'August 20, 2024',
      time: '3:00 PM', 
      location: 'St. Mary\'s Church',
      description: 'Join us as we exchange vows in a beautiful ceremony.'
    },
    { 
      id: 'reception',
      name: 'Wedding Reception', 
      date: 'August 20, 2024',
      time: '6:00 PM', 
      location: 'Grand Ballroom, The Ritz Hotel',
      description: 'Celebrate with us with dinner, dancing, and festivities.'
    }
  ];

  // Update form values when attendees change
  useEffect(() => {
    form.setValue('events.ceremony.attendeeIds', ceremonyAttendees);
    form.setValue('events.ceremony.isAttending', ceremonyAttendees.length > 0);
    
    form.setValue('events.reception.attendeeIds', receptionAttendees);
    form.setValue('events.reception.isAttending', receptionAttendees.length > 0);
  }, [ceremonyAttendees, receptionAttendees, form]);

  const toggleAttendee = (eventType: EventType, guestIndex: number) => {
    if (eventType === 'ceremony') {
      if (ceremonyAttendees.includes(guestIndex)) {
        setCeremonyAttendees(ceremonyAttendees.filter(idx => idx !== guestIndex));
      } else {
        setCeremonyAttendees([...ceremonyAttendees, guestIndex]);
      }
    } else if (eventType === 'reception') {
      if (receptionAttendees.includes(guestIndex)) {
        setReceptionAttendees(receptionAttendees.filter(idx => idx !== guestIndex));
      } else {
        setReceptionAttendees([...receptionAttendees, guestIndex]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {eventsData.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-6 w-6" />
              <CardTitle>{event.name}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="font-medium mb-3">Who will attend this event?</p>
              
              {guestsAttending.length > 0 ? (
                <div className="space-y-2">
                  {guestsAttending.map((guest, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${event.id}-guest-${index}`}
                        checked={
                          event.id === 'ceremony' 
                            ? ceremonyAttendees.includes(index)
                            : receptionAttendees.includes(index)
                        }
                        onCheckedChange={() => toggleAttendee(event.id as EventType, index)}
                      />
                      <Label htmlFor={`${event.id}-guest-${index}`}>
                        {guest.firstName} {guest.lastName}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-600">
                  No guests are marked as attending. Please go back and mark guests as attending.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <textarea
          id="additionalNotes"
          {...form.register('additionalNotes')}
          className="w-full p-3 border rounded-md"
          rows={3}
          placeholder="Any additional information you'd like us to know"
        />
      </div>
    </div>
  );
};