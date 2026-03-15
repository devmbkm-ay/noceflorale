import * as ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

// Type definitions
export interface Rsvp {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  attending: string;
  guestType: string;
  eventParticipation: string;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerEmail?: string;
  partnerTelephone?: string;
  partnerEventParticipation?: string;
  hasChildren: boolean;
  childrenCount?: number;
  children?: {
    id: string;
    name: string;
    age: number;
  }[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Format guest attendance status
export const formatAttendance = (status: string): string => {
  return status === "attending" ? "Oui" : "Non";
};

// Format event participation
export const formatEventParticipation = (participation: string): string => {
  switch (participation) {
    case "both":
      return "Les deux événements";
    case "blessing_only":
      return "Cérémonie uniquement";
    case "evening_only":
      return "Réception uniquement";
    case "none":
    default:
      return "Aucun";
  }
};

// Format guest type
export const formatGuestType = (type: string): string => {
  return type === "couple" ? "Couple" : "Seul";
};

// Format children information
export const formatChildren = (guest: Rsvp): string => {
  if (!guest.hasChildren || !guest.children || guest.children.length === 0) {
    return "";
  }
  return guest.children.map((c) => `${c.name} (${c.age} ans)`).join(", ");
};

// Get total guests count
export const getTotalGuestCount = (guest: Rsvp): number => {
  let total = 1; // Primary guest
  if (guest.guestType === "couple") total++; // Partner
  if (guest.hasChildren && guest.children) total += guest.children.length; // Children
  return total;
};

// Helper function to format guest full name
const formatGuestFullName = (guest: Rsvp): string => {
  return `${guest.firstName} ${guest.lastName}`.trim();
};

// Helper function to format partner full name
const formatPartnerFullName = (guest: Rsvp): string => {
  if (guest.guestType === "couple" && guest.partnerFirstName && guest.partnerLastName) {
    return `${guest.partnerFirstName} ${guest.partnerLastName}`;
  } else if (guest.guestType === "couple") {
    return "Partenaire non spécifié";
  }
  return "—";
};

// CSV Export (aligned with admin table format)
export const exportToCsv = (guests: Rsvp[]) => {
  // Create CSV header (matching admin table format)
  const headers = [
    "Nom",
    "Partenaire",
    "Statut",
    "Événement",
    "Type",
    "Enfants",
    "Total",
    // Optional detailed fields
    "Email",
    "Téléphone",
    "Email du partenaire",
    "Téléphone du partenaire",
    "Date de création",
    "Dernière mise à jour",
  ];

  // Format data for CSV (aligned with admin table format)
  const csvData = guests.map((guest) => [
    formatGuestFullName(guest),
    formatPartnerFullName(guest),
    formatAttendance(guest.attending),
    formatEventParticipation(guest.eventParticipation),
    formatGuestType(guest.guestType),
    formatChildren(guest),
    getTotalGuestCount(guest).toString(),
    // Optional detailed fields
    guest.email,
    guest.telephone || "",
    guest.partnerEmail || "",
    guest.partnerTelephone || "",
    new Date(guest.createdAt).toLocaleDateString("fr-FR"),
    guest.updatedAt
      ? new Date(guest.updatedAt).toLocaleDateString("fr-FR")
      : "",
  ]);

  // Combine headers and data
  const csvContent = [
    headers.join(","),
    ...csvData.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
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

  // Clean up
  if (link.parentNode) {
    link.parentNode.removeChild(link);
  }
  URL.revokeObjectURL(url);

  return true;
};

// Excel Export (aligned with admin table format)
export const exportToExcel = async (guests: Rsvp[]) => {
  // Prepare data for Excel (matching admin table format)
  const excelData = guests.map((guest) => ({
    Nom: formatGuestFullName(guest),
    Partenaire: formatPartnerFullName(guest),
    Statut: formatAttendance(guest.attending),
    Événement: formatEventParticipation(guest.eventParticipation),
    Type: formatGuestType(guest.guestType),
    Enfants: formatChildren(guest),
    Total: getTotalGuestCount(guest),
    // Optional detailed fields
    Email: guest.email,
    "Téléphone": guest.telephone || "",
    "Email du partenaire": guest.partnerEmail || "",
    "Téléphone du partenaire": guest.partnerTelephone || "",
    "Date de création": new Date(guest.createdAt).toLocaleDateString("fr-FR"),
    "Dernière mise à jour": guest.updatedAt
      ? new Date(guest.updatedAt).toLocaleDateString("fr-FR")
      : "",
  }));

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Invités");

  // Add headers
  const headers = Object.keys(excelData[0] || {});
  worksheet.addRow(headers);

  // Add data rows
  excelData.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });

  // Auto-size columns
  worksheet.columns.forEach((column, index) => {
    let maxLength = headers[index]?.length || 0;
    excelData.forEach((row) => {
      const cellValue = String(Object.values(row)[index] || '');
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = Math.min(maxLength + 2, 50); // Max width of 50
  });

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF6464DC' } // Royal blue
  };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invites-mariage-${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};

// PDF Export for printing
export const exportToPdf = (guests: Rsvp[], selectedFields: string[] = []) => {
  // Create new PDF document
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Liste des invités au mariage", 14, 20);
  doc.setFontSize(10);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 26);

  // Determine columns based on selected fields (aligned with admin table)
  const allFields = {
    name: "Nom",
    partnerFullName: "Partenaire",
    attending: "Statut",
    eventParticipation: "Événement",
    guestType: "Type",
    children: "Enfants",
    totalGuests: "Total",
    // Optional detailed fields
    email: "Email",
    telephone: "Téléphone",
    partnerEmail: "Email du Partenaire",
    partnerTelephone: "Téléphone du Partenaire",
    partnerEventParticipation: "Événements du Partenaire",
  };

  const columns =
    selectedFields.length > 0
      ? selectedFields.map((field) => ({
          header: allFields[field as keyof typeof allFields],
          dataKey: field,
        }))
      : Object.entries(allFields).map(([key, value]) => ({
          header: value,
          dataKey: key,
        }));

  // Helper function to format partner full name
  const formatPartnerFullName = (guest: Rsvp): string => {
    if (guest.guestType === "couple" && guest.partnerFirstName && guest.partnerLastName) {
      return `${guest.partnerFirstName} ${guest.partnerLastName}`;
    } else if (guest.guestType === "couple") {
      return "Partenaire non spécifié";
    }
    return "—";
  };

  // Format data for table (aligned with admin table format)
  const tableData = guests.map((guest) => {
    const rowData: Record<string, string | number> = {
      name: formatGuestFullName(guest),
      partnerFullName: formatPartnerFullName(guest),
      attending: formatAttendance(guest.attending),
      eventParticipation: formatEventParticipation(guest.eventParticipation),
      guestType: formatGuestType(guest.guestType),
      children: formatChildren(guest),
      totalGuests: getTotalGuestCount(guest),
      // Optional detailed fields
      email: guest.email,
      telephone: guest.telephone || "",
      partnerEmail: guest.partnerEmail || "",
      partnerTelephone: guest.partnerTelephone || "",
      partnerEventParticipation: guest.partnerEventParticipation
        ? formatEventParticipation(guest.partnerEventParticipation)
        : "",
    };

    return rowData;
  });
  // Create table
  autoTable(doc, {
    startY: 30,
    columns: columns,
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 100, 220], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 250] },
    margin: { top: 30 },
  } as UserOptions);

  // Calculate summary statistics
  const totalInvitedGuests = guests.length;
  const attendingGuests = guests.filter(g => g.attending === "attending").length;
  const notAttendingGuests = guests.filter(g => g.attending === "not_attending").length;
  const totalIndividuals = guests.reduce((total, guest) => {
    return total + getTotalGuestCount(guest);
  }, 0);
  const totalAdults = guests.reduce((total, guest) => {
    let adults = 1; // Primary guest
    if (guest.guestType === "couple") adults++; // Partner
    return total + adults;
  }, 0);
  const totalChildren = guests.reduce((total, guest) => {
    return total + (guest.children?.length || 0);
  }, 0);

  // Get the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 100;

  // Add summary section
  doc.setFontSize(12);
  doc.text("Résumé", 14, finalY + 20);
  
  doc.setFontSize(10);
  const summaryY = finalY + 30;
  const lineHeight = 6;
  
  // Summary statistics
  doc.text(`Total des invitations envoyées: ${totalInvitedGuests}`, 14, summaryY);
  doc.text(`Confirmations "Présent": ${attendingGuests}`, 14, summaryY + lineHeight);
  doc.text(`Confirmations "Absent": ${notAttendingGuests}`, 14, summaryY + (lineHeight * 2));
  doc.text(`Nombre total de personnes attendues: ${totalIndividuals}`, 14, summaryY + (lineHeight * 3));
  doc.text(`  - Adultes: ${totalAdults}`, 20, summaryY + (lineHeight * 4));
  doc.text(`  - Enfants: ${totalChildren}`, 20, summaryY + (lineHeight * 5));
  
  // Event participation breakdown
  const bothEvents = guests.filter(g => g.eventParticipation === "both" && g.attending === "attending").length;
  const ceremonyOnly = guests.filter(g => g.eventParticipation === "blessing_only" && g.attending === "attending").length;
  const receptionOnly = guests.filter(g => g.eventParticipation === "evening_only" && g.attending === "attending").length;
  
  doc.text(`Participation aux événements (présents uniquement):`, 14, summaryY + (lineHeight * 7));
  doc.text(`  - Les deux événements: ${bothEvents}`, 20, summaryY + (lineHeight * 8));
  doc.text(`  - Cérémonie uniquement: ${ceremonyOnly}`, 20, summaryY + (lineHeight * 9));
  doc.text(`  - Réception uniquement: ${receptionOnly}`, 20, summaryY + (lineHeight * 10));

  // Add generation timestamp
  doc.setFontSize(8);
  doc.text(`Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, 14, summaryY + (lineHeight * 12));

  // Save PDF
  doc.save(`liste-invites-${new Date().toISOString().split("T")[0]}.pdf`);

  return true;
};
/**
 * Extracts CSV headers from the header line
 */
const extractCsvHeaders = (headerLine: string): string[] => {
  return headerLine.split(",").map((header) => header.trim().replace(/"/g, ""));
};

/**
 * Parses a single CSV line, handling quoted values that might contain commas
 */
const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let startIdx = 0;
  let inQuote = false;

  for (let j = 0; j < line.length; j++) {
    if (line[j] === '"') {
      inQuote = !inQuote;
    } else if (line[j] === "," && !inQuote) {
      values.push(
        line.substring(startIdx, j).replace(/^"|"$/g, "").replace(/""/g, '"')
      );
      startIdx = j + 1;
    }
  }

  // Add the last value
  values.push(
    line.substring(startIdx).replace(/^"|"$/g, "").replace(/""/g, '"')
  );

  return values;
};

/**
 * Creates a row object by mapping headers to values
 */
const createRowObject = (
  headers: string[],
  values: string[]
): Record<string, string> => {
  const row: Record<string, string> = {};

  headers.forEach((header, index) => {
    if (index < values.length) {
      row[header] = values[index];
    } else {
      row[header] = "";
    }
  });

  return row;
};

// Parse CSV for import
export const parseImportedCsv = (csvContent: string) => {
  // Split by lines and remove empty lines
  const lines = csvContent.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("Le fichier CSV est vide ou ne contient que l'en-tête");
  }

  // Extract headers from first line
  const headers = extractCsvHeaders(lines[0]);

  // Parse data rows
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = createRowObject(headers, values);
    results.push(row);
  }

  return results;
};

// Parse Excel for import
export const parseImportedExcel = async (arrayBuffer: ArrayBuffer) => {
  // Read the Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  // Get the first worksheet
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error("No worksheet found in Excel file");
  }

  // Convert to JSON
  const results: Record<string, string>[] = [];
  const headers: string[] = [];
  
  // Get headers from first row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value || '');
  });

  // Process data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    
    const rowData: Record<string, string> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        rowData[header] = String(cell.value || '');
      }
    });
    
    // Only add non-empty rows
    if (Object.values(rowData).some(value => value.trim() !== '')) {
      results.push(rowData);
    }
  });

  return results;
};

// Convert imported data to RSVP format
export const convertImportedDataToRsvp = (
  importedData: Record<string, string>[]
) => {
  return importedData.map((row) => {
    // Map fields based on French column names
    const attending = row["Présent"] === "Oui" ? "attending" : "not_attending";

    let eventParticipation = "none";
    if (row["Événement"] === "Les deux événements") eventParticipation = "both";
    else if (row["Événement"] === "Cérémonie uniquement")
      eventParticipation = "blessing_only";
    else if (row["Événement"] === "Réception uniquement")
      eventParticipation = "evening_only";

    const guestType = row["Type d'invité"] === "Couple" ? "couple" : "single";

    // Parse children if present
    const childrenText = row["Enfants"] || "";
    const children = childrenText ? parseChildrenFromText(childrenText) : [];

    return {
      name: row["Nom"] || "",
      email: row["Email"] || "",
      telephone: row["Téléphone"] || "",
      attending,
      eventParticipation,
      guestType,
      partnerFirstName: row["Prénom du partenaire"] || "",
      partnerLastName: row["Nom du partenaire"] || "",
      partnerEmail: row["Email du partenaire"] || "",
      partnerTelephone: row["Téléphone du partenaire"] || "",
      hasChildren: children.length > 0,
      childrenCount: children.length,
      children,
    };
  });
};

// Helper to parse children from text (e.g., "John (5 ans), Mary (3 ans)")
const parseChildrenFromText = (childrenText: string) => {
  if (!childrenText) return [];

  const childEntries = childrenText.split(",").map((entry) => entry.trim());
  return childEntries.map((entry) => {
    const nameMatch = entry.match(/(.*?)\s*\((\d+)\s*ans\)/);
    if (nameMatch) {
      return {
        id: crypto.randomUUID(),
        name: nameMatch[1].trim(),
        age: parseInt(nameMatch[2], 10),
      };
    }
    return { id: crypto.randomUUID(), name: entry, age: 0 };
  });
};
