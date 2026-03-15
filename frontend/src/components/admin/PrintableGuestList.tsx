import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { exportToPdf } from "@/utils/exportImport";
import { Printer } from "lucide-react";

interface Field {
  id: string;
  label: string;
  field: string;
  selected: boolean;
}

interface Rsvp {
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

interface PrintableGuestListProps {
  guests: Rsvp[];
}

const PrintableGuestList: React.FC<PrintableGuestListProps> = ({ guests }) => {
  // Define available fields (aligned with admin table format)
  const [fields, setFields] = useState<Field[]>([
    // Primary fields (matching admin table)
    { id: "name", label: "Nom", field: "name", selected: true },
    { id: "partnerFullName", label: "Partenaire", field: "partnerFullName", selected: true },
    { id: "attending", label: "Statut", field: "attending", selected: true },
    {
      id: "eventParticipation",
      label: "Événement",
      field: "eventParticipation",
      selected: true,
    },
    {
      id: "guestType",
      label: "Type",
      field: "guestType",
      selected: true,
    },
    { id: "children", label: "Enfants", field: "children", selected: true },
    {
      id: "totalGuests",
      label: "Total",
      field: "totalGuests",
      selected: true,
    },
    // Optional detailed fields
    { id: "email", label: "Email (détaillé)", field: "email", selected: false },
    { id: "telephone", label: "Téléphone (détaillé)", field: "telephone", selected: false },
    {
      id: "partnerEmail",
      label: "Email du Partenaire (détaillé)",
      field: "partnerEmail",
      selected: false,
    },
    {
      id: "partnerTelephone",
      label: "Téléphone du Partenaire (détaillé)",
      field: "partnerTelephone",
      selected: false,
    },
    { 
      id: 'partnerEventParticipation', 
      label: 'Événements du Partenaire (détaillé)', 
      field: 'partnerEventParticipation', 
      selected: false 
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  // Toggle field selection
  const toggleField = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, selected: !field.selected } : field
      )
    );
  };

  // Select/Deselect all fields
  const toggleAllFields = (selected: boolean) => {
    setFields(fields.map((field) => ({ ...field, selected })));
  };

  // Generate PDF with selected fields
  const generatePdf = () => {
    const selectedFields = fields.filter((f) => f.selected).map((f) => f.field);
    exportToPdf(guests, selectedFields);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='border-royal-600 text-royal-600 hover:bg-royal-50'
        >
          <Printer size={16} className='mr-2' />
          Imprimer la liste
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Personnaliser la liste d&apos;impression</DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          <div className='flex justify-between mb-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => toggleAllFields(true)}
            >
              Tout sélectionner
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => toggleAllFields(false)}
            >
              Tout désélectionner
            </Button>
          </div>

          <Card className='p-4'>
            <div className='space-y-4'>
              {fields.map((field) => (
                <div key={field.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`field-${field.id}`}
                    checked={field.selected}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label
                    htmlFor={`field-${field.id}`}
                    className='flex-1 cursor-pointer'
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          <div className='mt-6 flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={generatePdf}
              disabled={!fields.some((f) => f.selected)}
              className='bg-royal-600 hover:bg-royal-700'
            >
              Générer PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintableGuestList;
