import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportToCsv, exportToExcel } from '@/utils/exportImport';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import PrintableGuestList from './PrintableGuestList';
import { Rsvp } from '@/graphql/rsvp';

interface ExportOptionsProps {
  guests?: Rsvp[];
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ guests }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCsvExport = () => {
    if (!guests || guests.length === 0) {
      console.warn('No guests data available for export');
      return;
    }
    exportToCsv(guests);
    setIsOpen(false);
  };

  const handleExcelExport = async () => {
    if (!guests || guests.length === 0) {
      console.warn('No guests data available for export');
      return;
    }
    await exportToExcel(guests);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div>
            <Button 
              variant="outline" 
              className="border-royal-600 text-royal-600 hover:bg-royal-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!guests || guests.length === 0}
              title={(!guests || guests.length === 0) ? "Aucune donnée à exporter" : "Exporter les données"}
            >
              <FileDown size={16} className="mr-2" />
              Exporter
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Options d&apos;exportation</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 grid grid-cols-1 gap-4">
            <Button 
              variant="outline" 
              className="flex justify-start items-center p-4 h-auto border-gray-300 hover:bg-royal-50 hover:border-royal-300"
              onClick={handleCsvExport}
            >
              <FileText size={24} className="mr-4 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Exporter en CSV</div>
                <div className="text-sm text-gray-500">Format compatible avec Excel, Google Sheets, etc.</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-start items-center p-4 h-auto border-gray-300 hover:bg-royal-50 hover:border-royal-300"
              onClick={handleExcelExport}
            >
              <FileSpreadsheet size={24} className="mr-4 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Exporter en Excel (.xlsx)</div>
                <div className="text-sm text-gray-500">Fichier Excel formaté avec colonnes ajustées</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Separate component for printable PDF */}
      <PrintableGuestList 
        guests={guests || []} 
      />
    </>
  );
};

export default ExportOptions;

