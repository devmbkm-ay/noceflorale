import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='text-sm text-gray-500'>
        Affichage de {startItem} à {endItem} sur {totalItems} invités
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className='text-royal-600 border-royal-600'
        >
          <ChevronLeft size={16} />
        </Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size='sm'
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "bg-royal-600"
                : "text-royal-600 border-royal-600"
            }
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='text-royal-600 border-royal-600'
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
