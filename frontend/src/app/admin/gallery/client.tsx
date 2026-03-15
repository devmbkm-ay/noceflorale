'use client';

import React from 'react';
import GalleryManager from '@/components/GalleryManager';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { HomeIcon, Image as ImageIcon } from 'lucide-react';

export default function AdminGalleryClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">
              <HomeIcon className="h-4 w-4 mr-1" />
              Admin
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/gallery" isCurrentPage>
              <ImageIcon className="h-4 w-4 mr-1" />
              Galerie
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration de la Galerie</h1>
        <p className="text-gray-600">
          Gérez les images qui apparaissent dans la galerie photo de votre site de mariage.
          Vous pouvez ajouter, modifier, supprimer et réorganiser les images.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <GalleryManager />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Conseils d&apos;utilisation</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Pour réorganiser les images, faites glisser-déposer à l&apos;aide de la poignée (icône à 6 points).</li>
          <li>Les images inactives ne sont pas visibles sur le site public mais restent dans la galerie d&apos;administration.</li>
          <li>Pour de meilleurs résultats, utilisez des images aux dimensions similaires (idéalement au format paysage).</li>
          <li>L&apos;URL de l&apos;image doit pointer directement vers un fichier image (jpg, png, gif, webp).</li>
          <li>Le texte alternatif est important pour l&apos;accessibilité et le référencement.</li>
        </ul>
      </div>
    </div>
  );
}

