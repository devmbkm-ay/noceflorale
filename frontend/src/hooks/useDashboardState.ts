import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "@/utils/safeToast";
import {
  GET_ALL_RSVPS,
  GET_RSVP_STATS,
  UPDATE_RSVP,
  DELETE_RSVP,
  Rsvp,
  RsvpStats,
} from "@/graphql/rsvp";

export function useDashboardState() {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contentManagementTab, setContentManagementTab] = useState("hero");

  // Filter controls state
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Guest modal state
  const [selectedGuest, setSelectedGuest] = useState<Rsvp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState<Rsvp | null>(null);

  // Photo management state
  const [photos, setPhotos] = useState<{ id: string; url: string; title?: string }[]>([
    { id: "1", url: "/images/first-maries-6.jpg", title: "Photo de mariage 1" },
    { id: "2", url: "/images/first-maries-6.jpg", title: "Photo de mariage 2" },
    { id: "3", url: "/images/first-maries-6.jpg", title: "Photo de mariage 3" },
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Website content state
  const [websiteContent, setWebsiteContent] = useState({
    // Hero section
    heroDate: "12 Juin 2023",
    heroCelebrationMessage: "Nous célébrons notre mariage",
    heroBrideName: "Marie",
    heroGroomName: "Jean",
    heroButtonLabel: "RSVP",
    heroSecondaryButtonLabel: "Plus d'informations",
    // Welcome section
    welcomeTitle: "Bienvenue à notre mariage",
    welcomeText: "Nous sommes ravis de vous inviter à célébrer notre union.",
    venueTitle: "Le lieu",
    venueDescription: "Notre mariage aura lieu dans un cadre idyllique...",
    timelineTitle: "Programme",
    timelineDescription: "Voici le déroulement de notre journée spéciale.",
    contactEmail: "contact@example.com",
    contactPhone: "01 23 45 67 89",
  });

  // GraphQL filter variables
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

  // GraphQL queries
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
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

  // GraphQL mutations
  const [updateRsvp, { loading: updateLoading }] = useMutation(UPDATE_RSVP, {
    onCompleted: () => {
      setTimeout(() => toast.success("RSVP updated successfully"), 0);
      setIsModalOpen(false);
      setIsEditing(false);
      refetchRsvps();
      refetchStats();
    },
    onError: (error) => {
      setTimeout(() => toast.error("Failed to update RSVP", {
        description: error.message,
      }), 0);
    },
  });

  const [deleteRsvp, { loading: deleteLoading }] = useMutation(DELETE_RSVP, {
    onCompleted: () => {
      setTimeout(() => toast.success("RSVP deleted successfully"), 0);
      setIsModalOpen(false);
      refetchRsvps();
      refetchStats();
    },
    onError: (error) => {
      setTimeout(() => toast.error("Failed to delete RSVP", {
        description: error.message,
      }), 0);
    },
  });

  // Computed stats
  const stats = statsData?.getRsvpStats || {
    totalGuests: 0,
    maxCapacity: 340,
    attending: 0,
    notAttending: 0,
    ceremonyOnly: 0,
    receptionOnly: 0,
    both: 0,
    totalAdults: 0,
    totalChildren: 0,
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,
    contentManagementTab,
    setContentManagementTab,
    
    // Filter state
    attendanceFilter,
    setAttendanceFilter,
    eventFilter,
    setEventFilter,
    searchQuery,
    setSearchQuery,
    
    // Guest modal state
    selectedGuest,
    setSelectedGuest,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    setIsEditing,
    editedGuest,
    setEditedGuest,
    
    // Photo state
    photos,
    setPhotos,
    selectedPhoto,
    setSelectedPhoto,
    isUploading,
    setIsUploading,
    
    // Content state
    websiteContent,
    setWebsiteContent,
    
    // GraphQL data and loading states
    stats,
    statsLoading,
    statsError,
    rsvpsData,
    rsvpsLoading,
    rsvpsError,
    
    // GraphQL functions
    refetchStats,
    refetchRsvps,
    updateRsvp,
    updateLoading,
    deleteRsvp,
    deleteLoading,
    getFilterVariables,
  };
}
