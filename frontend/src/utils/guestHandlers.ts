import { Rsvp } from "@/graphql/rsvp";

export interface GuestHandlers {
  handleSort: (field: string) => void;
  handleViewGuest: (guest: Rsvp) => void;
  handleEditGuest: (guest: Rsvp) => void;
  handleSaveGuest: () => Promise<void>;
  handleDeleteGuest: (guest: Rsvp) => Promise<void>;
  handleAddGuest: () => Promise<void>;
  handleChildrenToggle: (value: boolean, isNewGuest: boolean) => void;
  handleCloseModal: () => void;
  handleCancelEdit: () => void;
}

export function createGuestHandlers({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  setSelectedGuest,
  setIsModalOpen,
  setIsEditing,
  setEditedGuest,
  editedGuest,
  newGuest,
  setNewGuest,
  updateRsvp,
  deleteRsvp,
  createRsvp,
}: {
  sortField: string;
  sortDirection: "asc" | "desc";
  setSortField: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setSelectedGuest: (guest: Rsvp | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setEditedGuest: (guest: Rsvp | null) => void;
  editedGuest: Rsvp | null;
  newGuest: Partial<Rsvp>;
  setNewGuest: (guest: Partial<Rsvp>) => void;
  updateRsvp: any;
  deleteRsvp: any;
  createRsvp: any;
}): GuestHandlers {
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewGuest = (guest: Rsvp) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEditGuest = (guest: Rsvp) => {
    setSelectedGuest(guest);
    setEditedGuest({
      ...guest,
      partnerFirstName: guest.partnerFirstName || "",
      partnerLastName: guest.partnerLastName || "",
    });
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleSaveGuest = async () => {
    if (!editedGuest?.id) return;

    const variables = {
      id: editedGuest.id,
      guest: {
        firstName: editedGuest.firstName,
        lastName: editedGuest.lastName,
        email: editedGuest.email,
        telephone: editedGuest.telephone,
        attending: editedGuest.attending,
        guestType: editedGuest.guestType,
        eventParticipation: editedGuest.eventParticipation,
        partnerFirstName: editedGuest.partnerFirstName,
        partnerLastName: editedGuest.partnerLastName,
        partnerEmail: editedGuest.partnerEmail,
        partnerTelephone: editedGuest.partnerTelephone,
        partnerEventParticipation: editedGuest.partnerEventParticipation,
        hasChildren: editedGuest.hasChildren,
        childrenCount: editedGuest.childrenCount,
        children: editedGuest.children,
      },
    };

    console.log("Sending updateRsvp variables:", variables);
    await updateRsvp({ variables });
  };

  const handleDeleteGuest = async (guest: Rsvp) => {
    if (!guest.id) return;
    await deleteRsvp({ variables: { id: guest.id } });
  };

  const handleAddGuest = async () => {
    const variables = {
      guest: {
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        email: newGuest.email,
        telephone: newGuest.telephone,
        attending: newGuest.attending,
        guestType: newGuest.guestType,
        eventParticipation: newGuest.eventParticipation,
        hasChildren: newGuest.hasChildren,
        childrenCount: newGuest.childrenCount,
        children: newGuest.children,
      },
    };

    await createRsvp({ variables });
  };

  const handleChildrenToggle = (value: boolean, isNewGuest: boolean) => {
    if (isNewGuest) {
      setNewGuest({
        ...newGuest,
        hasChildren: value,
        childrenCount: value ? newGuest.childrenCount || 0 : 0,
        children: value ? newGuest.children || [] : [],
      });
    } else if (editedGuest) {
      setEditedGuest({
        ...editedGuest,
        hasChildren: value,
        childrenCount: value ? editedGuest.childrenCount || 0 : 0,
        children: value ? editedGuest.children || [] : [],
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGuest(null);
    setEditedGuest(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedGuest(null);
  };

  return {
    handleSort,
    handleViewGuest,
    handleEditGuest,
    handleSaveGuest,
    handleDeleteGuest,
    handleAddGuest,
    handleChildrenToggle,
    handleCloseModal,
    handleCancelEdit,
  };
}
