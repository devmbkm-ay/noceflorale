import { Rsvp } from "@/graphql/rsvp";
import { toast } from "@/utils/safeToast";

export function exportToCsv(rsvpsData: { getAllRsvps: Rsvp[] } | undefined) {
  if (!rsvpsData?.getAllRsvps) return;

  // Create CSV header
  const headers = [
    "Name",
    "Email",
    "Attending",
    "Event",
    "Guest Type",
    "Partner Name",
    "Partner Email",
    "Children",
    "Dietary Requirements",
    "Notes",
  ];

  // Format data for CSV
  const csvData = rsvpsData.getAllRsvps.map((guest) => [
    `${guest.firstName} ${guest.lastName}`,
    guest.email,
    guest.attending === "attending" ? "Yes" : "No",
    guest.eventParticipation === "both"
      ? "Both Events"
      : guest.eventParticipation === "blessing_only"
      ? "Ceremony Only"
      : guest.eventParticipation === "evening_only"
      ? "Reception Only"
      : "None",
    guest.guestType === "couple" ? "Couple" : "Single",
    guest.partnerFirstName && guest.partnerLastName 
      ? `${guest.partnerFirstName} ${guest.partnerLastName}`
      : "",
    guest.partnerEmail || "",
    guest.hasChildren && guest.children
      ? guest.children.map((c) => `${c.name} (${c.age})`).join(", ")
      : "",
    // guest.dietaryRequirements || '',
    // guest.notes || ''
  ]);

  // Combine headers and data
  const csvContent = [
    headers.join(","),
    ...csvData.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"}`).join(",")
    ),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `wedding-guests-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();

  // Clean up the link element
  if (link.parentNode) {
    link.parentNode.removeChild(link);
  }

  // Use setTimeout to delay the toast notification to avoid rendering conflicts
  setTimeout(() => {
    toast.success("CSV file exported successfully");
  }, 0);
}

export function createDashboardHandlers({
  setSelectedGuest,
  setEditedGuest,
  setIsModalOpen,
  setIsEditing,
  updateRsvp,
  deleteRsvp,
}: {
  setSelectedGuest: (guest: Rsvp | null) => void;
  setEditedGuest: (guest: Rsvp | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  updateRsvp: any;
  deleteRsvp: any;
}) {
  const openGuestModal = (guest: Rsvp) => {
    setSelectedGuest(guest);
    setEditedGuest({ ...guest });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const saveGuestChanges = (editedGuest: Rsvp | null) => {
    if (!editedGuest?.id) return;

    const input = {
      firstName: editedGuest.firstName,
      lastName: editedGuest.lastName,
      email: editedGuest.email,
      attending: editedGuest.attending,
      guestType: editedGuest.guestType,
      eventParticipation: editedGuest.eventParticipation,
      partnerFirstName: editedGuest.partnerFirstName,
      partnerLastName: editedGuest.partnerLastName,
      partnerEmail: editedGuest.partnerEmail,
      partnerEventParticipation: editedGuest.partnerEventParticipation,
      hasChildren: editedGuest.hasChildren,
      childrenCount: editedGuest.childrenCount,
      children: editedGuest.children,
    };

    updateRsvp({
      variables: {
        id: editedGuest.id,
        guest: input,
      },
    });
  };

  const confirmDeleteGuest = (selectedGuest: Rsvp | null) => {
    if (!selectedGuest?.id) return;

    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer le RSVP pour ${
          `${selectedGuest.firstName} ${selectedGuest.lastName}` || "cet invité"
        }?`
      )
    ) {
      deleteRsvp({
        variables: {
          id: selectedGuest.id,
        },
      });
    }
  };

  return {
    openGuestModal,
    saveGuestChanges,
    confirmDeleteGuest,
  };
}
