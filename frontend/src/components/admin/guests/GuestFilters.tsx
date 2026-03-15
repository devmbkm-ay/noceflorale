import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Plus } from "lucide-react";
import ExportOptions from "@/components/admin/ExportOptions";
import ImportGuests from "@/components/admin/ImportGuests";
import { Rsvp } from "@/graphql/rsvp";

interface GuestFiltersProps {
  attendanceFilter: string;
  setAttendanceFilter: (value: string) => void;
  eventFilter: string;
  setEventFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onAddGuest: () => void;
  onImportComplete?: () => void;
  rsvpsData?: {
    getAllRsvps?: Rsvp[];
  };
}

export function GuestFilters({
  attendanceFilter,
  setAttendanceFilter,
  eventFilter,
  setEventFilter,
  searchQuery,
  setSearchQuery,
  onAddGuest,
  onImportComplete,
  rsvpsData,
}: GuestFiltersProps) {
  return (
    <Card className='mb-6'>
      <CardContent className='pt-6'>
        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-end'>
          {/* Filter Controls */}
          <div className='flex flex-wrap gap-4 flex-1'>
            <div className='w-full sm:w-auto'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Filtrer par statut
              </label>
              <select
                className='border rounded-md px-3 py-2 w-full sm:w-auto'
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
              >
                <option value='all'>Tous</option>
                <option value='attending'>Présents</option>
                <option value='not_attending'>Absents</option>
              </select>
            </div>

            <div className='w-full sm:w-auto'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Filtrer par événement
              </label>
              <select
                className='border rounded-md px-3 py-2 w-full sm:w-auto'
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value='all'>Tous</option>
                <option value='both'>Les deux événements</option>
                <option value='blessing_only'>Cérémonie uniquement</option>
                <option value='evening_only'>Réception uniquement</option>
              </select>
            </div>

            <div className='w-full sm:flex-1 lg:max-w-xs'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Rechercher
              </label>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Rechercher par nom ou email'
                  className='border rounded-md pl-10 pr-3 py-2 w-full'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={onAddGuest}
              className='bg-royal-600 hover:bg-royal-700 text-white'
            >
              <Plus size={16} className='mr-2' />
              Ajouter un invité
            </Button>
            
            <ExportOptions guests={rsvpsData?.getAllRsvps} />
            <ImportGuests onImportComplete={onImportComplete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
