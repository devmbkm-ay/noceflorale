import React from "react";
import { Card } from "@/components/ui/card";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  attending: string;
  eventParticipation: string;
  guestType: string;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerEmail?: string;
  partnerEventParticipation?: string;
  hasChildren: boolean;
  children?: {
    id: string;
    name: string;
    age: number;
  }[];
  createdAt: string | number | Date;
}

interface Stats {
  totalGuests: number;
  maxCapacity: number;
  attending: number;
  notAttending: number;
  ceremonyOnly: number;
  receptionOnly: number;
  both: number;
  totalAdults: number;
  totalChildren: number;
}

interface EventAttendanceBreakdownProps {
  rsvps: Guest[];
  stats: Stats;
}

const EventAttendanceBreakdown: React.FC<EventAttendanceBreakdownProps> = ({
  rsvps,
}) => {
  // Add debugging to see the actual data structure
  // React.useEffect(() => {
  //   console.log("RSVP Data:", rsvps);
  //   const couplesData = rsvps.filter((r) => r.guestType === "couple");
  //   console.log("Couples Data:", couplesData);
  // }, [rsvps]);

  // Filter functions for different event types
  const ceremonyOnlySingles = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "single" &&
      r.eventParticipation === "blessing_only"
  );

  const ceremonyOnlyCouples = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "couple" &&
      r.eventParticipation === "blessing_only"
  );

  const receptionOnlySingles = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "single" &&
      r.eventParticipation === "evening_only"
  );

  const receptionOnlyCouples = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "couple" &&
      r.eventParticipation === "evening_only"
  );

  const bothEventsSingles = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "single" &&
      r.eventParticipation === "both"
  );

  const bothEventsCouples = rsvps.filter(
    (r) =>
      r.attending === "attending" &&
      r.guestType === "couple" &&
      r.eventParticipation === "both"
  );

  // Calculate total attendees for each event
  const totalCeremonyGuests =
    ceremonyOnlySingles.length +
    ceremonyOnlyCouples.length * 2 +
    bothEventsSingles.length +
    bothEventsCouples.length * 2;

  const totalReceptionGuests =
    receptionOnlySingles.length +
    receptionOnlyCouples.length * 2 +
    bothEventsSingles.length +
    bothEventsCouples.length * 2;

  return (
    <div className='space-y-6'>
      {/* Event attendance statistics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-medium text-blue-800 mb-1'>
            Présence à la cérémonie
          </h3>
          <div className='flex justify-between items-center'>
            <p className='text-2xl font-bold text-blue-700'>
              {totalCeremonyGuests}
            </p>
            <div className='text-sm text-blue-600'>
              <div>
                Seuls: {ceremonyOnlySingles.length + bothEventsSingles.length}
              </div>
              <div>
                Couples: {ceremonyOnlyCouples.length + bothEventsCouples.length}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-purple-50 p-4 rounded-lg'>
          <h3 className='font-medium text-purple-800 mb-1'>
            Présence à la réception
          </h3>
          <div className='flex justify-between items-center'>
            <p className='text-2xl font-bold text-purple-700'>
              {totalReceptionGuests}
            </p>
            <div className='text-sm text-purple-600'>
              <div>
                Seuls: {receptionOnlySingles.length + bothEventsSingles.length}
              </div>
              <div>
                Couples:{" "}
                {receptionOnlyCouples.length + bothEventsCouples.length}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-amber-50 p-4 rounded-lg'>
          <h3 className='font-medium text-amber-800 mb-1'>
            Les deux événements
          </h3>
          <div className='flex justify-between items-center'>
            <p className='text-2xl font-bold text-amber-700'>
              {bothEventsSingles.length + bothEventsCouples.length * 2}
            </p>
            <div className='text-sm text-amber-600'>
              <div>Seuls: {bothEventsSingles.length}</div>
              <div>Couples: {bothEventsCouples.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest attendance by event */}
      <Card className='p-6'>
        <h3 className='font-medium text-gray-700 mb-3'>
          Liste des invités par événement
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nom
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Événement
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Partenaire
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Enfants
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y divide-gray-200'>
              {rsvps
                .filter((r) => r.attending === "attending")
                .map((rsvp) => (
                  <tr key={rsvp.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 font-medium'>
                      {rsvp.firstName} {rsvp.lastName}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          rsvp.guestType === "single"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rsvp.guestType === "single" ? "Seul" : "Couple"}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          rsvp.eventParticipation === "both"
                            ? "bg-amber-100 text-amber-800"
                            : rsvp.eventParticipation === "blessing_only"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {rsvp.eventParticipation === "both"
                          ? "Les deux événements"
                          : rsvp.eventParticipation === "blessing_only"
                          ? "Cérémonie uniquement"
                          : "Réception uniquement"}
                      </span>
                    </td>

                    <td className='px-4 py-3'>
                      {/* Enhanced partner information display with debugging */}
                      {(() => {
                        // Debug log for this specific row
                        if (rsvp.guestType === "couple") {
                          console.log(
                            `Partner data for ${rsvp.firstName} ${rsvp.lastName}:`,
                            {
                              partnerFirstName: rsvp.partnerFirstName,
                              partnerLastName: rsvp.partnerLastName,
                              partnerEventParticipation:
                                rsvp.partnerEventParticipation,
                            }
                          );
                        }

                        if (rsvp.guestType === "couple") {
                          // Check if we have either partner email OR partner names
                          if (
                            rsvp.partnerEmail ||
                            rsvp.partnerFirstName ||
                            rsvp.partnerLastName
                          ) {
                            return (
                              <div>
                                <span className='text-gray-700'>
                                  {rsvp.partnerFirstName ||
                                    (rsvp.partnerEmail &&
                                      rsvp.partnerEmail.split("@")[0]) ||
                                    "Partenaire"}{" "}
                                  {rsvp.partnerLastName || ""}
                                </span>
                                {rsvp.partnerEmail && (
                                  <span className='block text-xs text-gray-500'>
                                    {rsvp.partnerEmail}
                                  </span>
                                )}
                                {rsvp.partnerEventParticipation &&
                                  rsvp.partnerEventParticipation !==
                                    rsvp.eventParticipation && (
                                    <span className='block text-xs text-gray-500 mt-1'>
                                      Événement:{" "}
                                      {rsvp.partnerEventParticipation === "both"
                                        ? "Les deux"
                                        : rsvp.partnerEventParticipation ===
                                          "blessing_only"
                                        ? "Cérémonie"
                                        : "Réception"}
                                    </span>
                                  )}
                              </div>
                            );
                          } else {
                            return (
                              <span className='text-amber-600 italic text-sm'>
                                Informations partenaire manquantes
                              </span>
                            );
                          }
                        } else {
                          return <span className='text-gray-400'>-</span>;
                        }
                      })()}
                    </td>

                    <td className='px-4 py-3'>
                      {rsvp.hasChildren &&
                      rsvp.children &&
                      rsvp.children.length > 0 ? (
                        <div>
                          <span className='text-gray-700'>
                            {rsvp.children.length}{" "}
                            {rsvp.children.length === 1 ? "enfant" : "enfants"}
                          </span>
                          <span className='block text-xs text-gray-500 mt-1'>
                            {rsvp.children.map((c) => c.name).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <span className='text-gray-400'>-</span>
                      )}
                    </td>
                    <td className='px-4 py-3 font-bold text-royal-600'>
                      {(() => {
                        let total = 1; // Primary guest
                        if (rsvp.guestType === "couple") total++; // Partner
                        if (rsvp.hasChildren && rsvp.children)
                          total += rsvp.children.length; // Children
                        return total;
                      })()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default EventAttendanceBreakdown;
