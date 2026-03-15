"use client";

import React from "react";
import { Rsvp } from "@/graphql/rsvp";
import { useGuestManagement } from "@/hooks/useGuestManagement";
import { createGuestHandlers } from "@/utils/guestHandlers";
import { sortGuests, paginateGuests } from "@/utils/guestDataProcessing";

// Import modular components
import { GuestStatsCards } from "./GuestStatsCards";
import { GuestFilters } from "./GuestFilters";
import { GuestTable } from "./GuestTable";
import { PaginationControls } from "./PaginationControls";
import { GuestModal } from "./GuestModal";
import { AddGuestModal } from "./AddGuestModal";
import { FeedbackModal } from "./FeedbackModal";
import { EventAttendanceBreakdown } from "./EventAttendanceBreakdown";

export function GuestPageContent() {
  // Use custom hook for guest management
  const guestState = useGuestManagement();
  
  // Additional state for feedback modal
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [selectedFeedbackGuest, setSelectedFeedbackGuest] = React.useState<Rsvp | null>(null);

  // Create handlers using utility function
  const handlers = createGuestHandlers(guestState);

  // Additional handlers for special cases
  const handleDeleteGuest = (guest: Rsvp) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${guest.firstName} ${guest.lastName}?`)) {
      handlers.handleDeleteGuest(guest);
    }
  };

  const handleToggleAttendance = (guest: Rsvp) => {
    const newStatus = guest.attending === "attending" ? "not_attending" : "attending";
    guestState.updateRsvp({
      variables: {
        id: guest.id,
        input: { ...guest, attending: newStatus },
      },
    });
  };

  const handleGuestFieldChange = (field: string, value: unknown) => {
    guestState.setEditedGuest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNewGuestFieldChange = (field: string, value: unknown) => {
    guestState.setNewGuest(prev => ({ ...prev, [field]: value }));
  };
  
  // Feedback modal handler
  const handleSendFeedback = (guest: Rsvp) => {
    setSelectedFeedbackGuest(guest);
    setFeedbackModalOpen(true);
  };
  
  const handleCloseFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedFeedbackGuest(null);
  };

  // Data processing
  const sortedGuests = guestState.rsvpsData?.getAllRsvps
    ? sortGuests(
        guestState.rsvpsData.getAllRsvps.filter(guest => guest != null), 
        guestState.sortField, 
        guestState.sortDirection
      )
    : [];

  const { paginatedGuests, totalPages } = paginateGuests(
    sortedGuests,
    guestState.currentPage,
    guestState.itemsPerPage
  );

  return (
    <>
      {/* Stats */}
      <GuestStatsCards stats={guestState.stats} isLoading={guestState.statsLoading} />

      {/* Event Attendance Breakdown */}
      <EventAttendanceBreakdown guests={sortedGuests} />

      {/* Filters */}
      <GuestFilters
        attendanceFilter={guestState.attendanceFilter}
        setAttendanceFilter={guestState.setAttendanceFilter}
        eventFilter={guestState.eventFilter}
        setEventFilter={guestState.setEventFilter}
        searchQuery={guestState.searchQuery}
        setSearchQuery={guestState.setSearchQuery}
        onAddGuest={() => guestState.setShowAddGuest(true)}
        onImportComplete={() => {
          guestState.refetchRsvps();
          guestState.refetchStats();
        }}
        rsvpsData={guestState.rsvpsData}
      />

      {/* Table */}
      <GuestTable
        guests={paginatedGuests}
        isLoading={guestState.rsvpsLoading}
        error={guestState.rsvpsError}
        sortField={guestState.sortField}
        sortDirection={guestState.sortDirection}
        onSort={handlers.handleSort}
        onViewGuest={handlers.handleViewGuest}
        onEditGuest={handlers.handleEditGuest}
        onDeleteGuest={handleDeleteGuest}
        onToggleAttendance={handleToggleAttendance}
        onSendFeedback={handleSendFeedback}
      />

      {/* Pagination */}
      <PaginationControls
        currentPage={guestState.currentPage}
        totalPages={totalPages}
        itemsPerPage={guestState.itemsPerPage}
        totalItems={sortedGuests.length}
        onPageChange={guestState.setCurrentPage}
      />

      {/* Guest Modal */}
      <GuestModal
        guest={guestState.selectedGuest}
        editedGuest={guestState.editedGuest}
        isOpen={guestState.isModalOpen}
        isEditing={guestState.isEditing}
        isUpdateLoading={guestState.updateLoading}
        isDeleteLoading={guestState.deleteLoading}
        onClose={handlers.handleCloseModal}
        onEdit={() => guestState.setIsEditing(true)}
        onSave={handlers.handleSaveGuest}
        onDelete={() => guestState.selectedGuest && handleDeleteGuest(guestState.selectedGuest)}
        onFieldChange={handleGuestFieldChange}
      />

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={guestState.showAddGuest}
        newGuest={guestState.newGuest}
        isCreateLoading={guestState.createLoading}
        onClose={() => guestState.setShowAddGuest(false)}
        onSave={handlers.handleAddGuest}
        onFieldChange={handleNewGuestFieldChange}
      />
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        guest={selectedFeedbackGuest}
        onClose={handleCloseFeedbackModal}
      />
    </>
  );
}
