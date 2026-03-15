import { Metadata } from 'next';
import { ReactNode } from 'react';
import AdminClientLayout from './client-layout';

// Export metadata as a server component
export const metadata: Metadata = {
  title: 'Tableau de Bord Admin | Noce Florale',
  description: 'Tableau de bord administrateur pour gérer les galeries et les informations des invités',
};

// Server component layout
export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
