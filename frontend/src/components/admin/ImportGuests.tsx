import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseImportedCsv, parseImportedExcel, convertImportedDataToRsvp } from '@/utils/exportImport';
import { UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_RSVP } from '@/graphql/rsvp';

interface ImportGuestsProps {
  onImportComplete?: () => void;
}

const ImportGuests: React.FC<ImportGuestsProps> = ({ onImportComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string>[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{success: number, errors: number, messages: string[]}>({ 
    success: 0, 
    errors: 0, 
    messages: [] 
  });
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'results'>('upload');

  const [createRsvp] = useMutation(CREATE_RSVP, {
    onCompleted: () => {
      // Success handling is done in batch
    },
    onError: () => {
      // Error handling is done in batch
    },
  });

  // Handle file selection
  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    parseFile(file);
  };

  // Parse the uploaded file
  const parseFile = async (file: File) => {
    try {
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const parsedData = parseImportedCsv(text);
        setParsedData(parsedData);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const parsedData = await parseImportedExcel(buffer);
        setParsedData(parsedData);
      } else {
        toast.error('Format de fichier non pris en charge. Utilisez CSV ou Excel.');
        return;
      }
      setImportStep('preview');
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error(`Erreur lors de l&apos;analyse du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Import the data
  const importData = async () => {
    if (!parsedData) return;
    
    setImporting(true);
    setImportResults({ success: 0, errors: 0, messages: [] });
    
    const formattedData = convertImportedDataToRsvp(parsedData);
    const results = { success: 0, errors: 0, messages: [] as string[] };
    
    // Import each guest sequentially to handle errors properly
    for (const guest of formattedData) {
      try {
        // Skip if no firstName or email
        if (!guest.name || !guest.email) {
          results.errors++;
          results.messages.push(`Skipped: Missing name or email for a guest`);
          continue;
        }
        
        await createRsvp({ variables: { guest } });
        results.success++;
      } catch (error) {
        results.errors++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.messages.push(`Error for ${guest.name}: ${errorMessage}`);
      }
    }
    
    setImportResults(results);
    setImporting(false);
    setImportStep('results');
    
    // Only call onImportComplete if at least one guest was successfully imported
    if (results.success > 0 && onImportComplete) {
      onImportComplete();
    }
  };

  // Reset the import process
  const resetImport = () => {
    setUploadedFile(null);
    setParsedData(null);
    setImportResults({ success: 0, errors: 0, messages: [] });
    setImportStep('upload');
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Close dialog and reset
  const handleCloseDialog = () => {
    setIsOpen(false);
    // If we had successful imports, wait a bit before resetting the state
    if (importResults.success > 0) {
      setTimeout(resetImport, 500);
    } else {
      resetImport();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-royal-600 text-royal-600 hover:bg-royal-50">
          <UploadCloud size={16} className="mr-2" />
          Importer des invités
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {importStep === 'upload' && "Importer des invités depuis un fichier"}
            {importStep === 'preview' && "Aperçu des données à importer"}
            {importStep === 'results' && "Résultats de l&apos;importation"}
          </DialogTitle>
        </DialogHeader>
        
        {/* Upload step */}
        {importStep === 'upload' && (
          <div className="py-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-10 text-center ${isDragging ? 'border-royal-500 bg-royal-50' : 'border-gray-300'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium">
                Glissez et déposez un fichier CSV ou Excel ici
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ou
              </p>
              <div className="mt-2">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-md bg-royal-600 px-3 py-2 text-sm font-medium text-white hover:bg-royal-700"
                >
                  Sélectionner un fichier
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Formats supportés: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
            
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4">
              <h3 className="font-medium text-amber-800 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                Format attendu
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Le fichier doit contenir des colonnes avec les en-têtes suivants: Nom, Email, Téléphone, Présent (Oui/Non), Événement, Type d&apos;invité, etc.
              </p>
            </div>
          </div>
        )}
        
        {/* Preview step */}
        {importStep === 'preview' && parsedData && (
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{parsedData.length}</span> invités trouvés dans le fichier. Vérifiez l&apos;aperçu ci-dessous avant d&apos;importer.
              </p>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {parsedData.length > 0 && Object.keys(parsedData[0]).slice(0, 5).map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).slice(0, 5).map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{String(cell)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {parsedData.length > 10 && (
                <div className="p-2 bg-gray-50 text-center text-sm text-gray-500">
                  Affichage de 10 entrées sur {parsedData.length}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={resetImport}>
                Retour
              </Button>
              <Button 
                onClick={importData} 
                disabled={importing}
                className="bg-royal-600 hover:bg-royal-700"
              >
                {importing ? 'Importation en cours...' : 'Importer les données'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Results step */}
        {importStep === 'results' && (
          <div className="py-4">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="font-medium">Importation terminée</p>
                  <p className="text-sm text-gray-600">
                    {importResults.success} succès, {importResults.errors} erreurs
                  </p>
                </div>
              </div>
            </div>
            
            {importResults.messages.length > 0 && (
              <div className="mb-6 border rounded-md overflow-hidden">
                <div className="max-h-60 overflow-auto p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Messages:</h3>
                  <ul className="text-sm space-y-1">
                    {importResults.messages.map((message, index) => (
                      <li key={index} className="text-red-600">{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleCloseDialog}
                className="bg-royal-600 hover:bg-royal-700"
              >
                Terminer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportGuests;

