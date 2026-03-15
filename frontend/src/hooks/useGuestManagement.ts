import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "@/utils/safeToast";
import {
  GET_ALL_RSVPS,
  GET_RSVP_STATS,
  CREATE_RSVP,
  UPDATE_RSVP,
  DELETE_RSVP,
  Rsvp,
  RsvpStats,
} from "@/graphql/rsvp";

export function useGuestManagement() {
  // State for filters and pagination
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("firstName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for guest modal
  const [selectedGuest, setSelectedGuest] = useState<Rsvp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState<Rsvp | null>(null);

  // State for add guest modal
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState<Partial<Rsvp>>({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    attending: "attending",
    guestType: "single",
    eventParticipation: "both",
    hasChildren: false,
    childrenCount: 0,
    children: [],
  });

  // GraphQL filters
  const getFilterVariables = useCallback(() => {
    const variables: {
      attending?: string;
      eventParticipation?: string;
      search?: string;
    } = {};

    if (attendanceFilter !== "all") {
      variables.attending = attendanceFilter;
    }
    if (eventFilter !== "all") {
      variables.eventParticipation = eventFilter;
    }
    if (searchQuery.trim()) {
      variables.search = searchQuery.trim();
    }

    return variables;
  }, [attendanceFilter, eventFilter, searchQuery]);

  // GraphQL queries and mutations
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery<{ getRsvpStats: RsvpStats }>(GET_RSVP_STATS);

  const {
    data: rsvpsData,
    loading: rsvpsLoading,
    error: rsvpsError,
    refetch: refetchRsvps,
  } = useQuery<{ getAllRsvps: Rsvp[] }>(GET_ALL_RSVPS, {
    variables: getFilterVariables(),
    fetchPolicy: "cache-and-network",
  });

  const [createRsvp, { loading: createLoading }] = useMutation(CREATE_RSVP, {
    onCompleted: () => {
      setTimeout(() => toast.success("Invité créé avec succès"), 0);
      setShowAddGuest(false);
      refetchRsvps();
      refetchStats();
      resetNewGuest();
    },
    onError: (error) => {
      setTimeout(() => toast.error("Erreur lors de la création", {
        description: error.message,
      }), 0);
    },
  });

  const [updateRsvp, { loading: updateLoading }] = useMutation(UPDATE_RSVP, {
    onCompleted: () => {
      setTimeout(() => toast.success("Invité mis à jour avec succès"), 0);
      setIsModalOpen(false);
      setIsEditing(false);
      refetchRsvps();
      refetchStats();
    },
    onError: (error) => {
      setTimeout(() => toast.error("Erreur lors de la mise à jour", {
        description: error.message,
      }), 0);
    },
  });

  const [deleteRsvp, { loading: deleteLoading }] = useMutation(DELETE_RSVP, {
    onCompleted: () => {
      setTimeout(() => toast.success("Invité supprimé avec succès"), 0);
      setIsModalOpen(false);
      refetchRsvps();
      refetchStats();
    },
    onError: (error) => {
      setTimeout(() => toast.error("Erreur lors de la suppression", {
        description: error.message,
      }), 0);
    },
  });

  // Effects
  useEffect(() => {
    refetchRsvps({ variables: getFilterVariables() });
  }, [getFilterVariables, refetchRsvps]);

  // Helper functions
  const resetNewGuest = () => {
    setNewGuest({
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      attending: "attending",
      guestType: "single",
      eventParticipation: "both",
      hasChildren: false,
      childrenCount: 0,
      children: [],
    });
  };

  const stats = statsData?.getRsvpStats || {
    totalGuests: 0,
    attending: 0,
    notAttending: 0,
    ceremonyOnly: 0,
    receptionOnly: 0,
    both: 0,
    totalAdults: 0,
    totalChildren: 0,
    maxCapacity: 340,
  };

  return {
    // State
    attendanceFilter,
    setAttendanceFilter,
    eventFilter,
    setEventFilter,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedGuest,
    setSelectedGuest,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    setIsEditing,
    editedGuest,
    setEditedGuest,
    showAddGuest,
    setShowAddGuest,
    newGuest,
    setNewGuest,
    
    // Data
    stats,
    statsLoading,
    rsvpsData,
    rsvpsLoading,
    rsvpsError,
    
    // Mutations
    createRsvp,
    createLoading,
    updateRsvp,
    updateLoading,
    deleteRsvp,
    deleteLoading,
    
    // Functions
    refetchRsvps,
    refetchStats,
    resetNewGuest,
  };
}
