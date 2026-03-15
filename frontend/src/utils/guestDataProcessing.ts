import { Rsvp } from "@/graphql/rsvp";

export function sortGuests(
  guests: Rsvp[],
  sortField: string,
  sortDirection: "asc" | "desc"
): Rsvp[] {
  // Filter out any null or undefined guests first
  const validGuests = guests.filter(guest => guest != null);
  
  return [...validGuests].sort((a, b) => {
    // Additional safety check
    if (!a || !b) return 0;
    
    let aValue: unknown = a[sortField as keyof Rsvp];
    let bValue: unknown = b[sortField as keyof Rsvp];

    // Handle null/undefined values
    if (aValue === undefined || aValue === null) aValue = "";
    if (bValue === undefined || bValue === null) bValue = "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });
}

export function paginateGuests(
  guests: Rsvp[],
  currentPage: number,
  itemsPerPage: number
): { paginatedGuests: Rsvp[]; totalPages: number } {
  // Handle null/undefined guests array
  if (!guests || !Array.isArray(guests)) {
    return { paginatedGuests: [], totalPages: 0 };
  }
  
  const totalPages = Math.ceil(guests.length / itemsPerPage);
  const paginatedGuests = guests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return { paginatedGuests, totalPages };
}
