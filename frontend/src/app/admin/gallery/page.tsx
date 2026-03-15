import { Metadata } from 'next';
import AdminGalleryClient from './client';

export const metadata: Metadata = {
  title: 'Administration de la Galerie | Noce Florale',
  description: 'Gérez les images de la galerie de votre site de mariage',
};

export default function AdminGalleryPage() {
  return <AdminGalleryClient />;
}

