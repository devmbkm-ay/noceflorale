"use client";

import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "@/utils/safeToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Calendar, Clock, MapPin, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";

// GraphQL queries and mutations
const GET_WEDDING_DETAILS = gql`
  query GetWeddingDetails {
    getWeddingDetails {
      id
      ceremonyDate
      ceremonyTime
      ceremonyLocation
      ceremonyAddress
      receptionTime
      receptionLocation
      receptionAddress
      additionalInfo
    }
  }
`;

const UPDATE_WEDDING_DETAILS = gql`
  mutation UpdateWeddingDetails($input: WeddingDetailsInput!) {
    updateWeddingDetails(input: $input) {
      id
      ceremonyDate
      ceremonyTime
      ceremonyLocation
      ceremonyAddress
      receptionTime
      receptionLocation
      receptionAddress
      additionalInfo
    }
  }
`;

// Types
interface WeddingDetails {
  id?: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  receptionTime: string;
  receptionLocation: string;
  receptionAddress: string;
  additionalInfo: string;
}

export default function WeddingDetailsPage() {
  // Initial state with default values
  const [details, setDetails] = useState<WeddingDetails>({
    ceremonyDate: "29 Août , 2025",
    ceremonyTime: "14h30",
    ceremonyLocation: "Église Saint Marie",
    ceremonyAddress: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
    receptionTime: "19h00",
    receptionLocation: "Salle de réception 77",
    receptionAddress: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
    additionalInfo: "Mafamille et moi nous servirons l'Éternel. Josué 24:15",
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Fetch wedding details
  const { data, loading, error } = useQuery(GET_WEDDING_DETAILS, {
    onCompleted: (data) => {
      if (data?.getWeddingDetails) {
        setDetails(data.getWeddingDetails);
      }
    },
    fetchPolicy: "cache-and-network",
  });

  // Update wedding details mutation
  const [updateWeddingDetails, { loading: updateLoading }] = useMutation(
    UPDATE_WEDDING_DETAILS,
    {
      onCompleted: () => {
        toast.success("Détails du mariage mis à jour avec succès");
        setHasChanges(false);
      },
      onError: (error) => {
        toast.error("Échec de la mise à jour des détails du mariage", {
          description: error.message,
        });
      },
    }
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  // Save wedding details
  const handleSave = () => {
    updateWeddingDetails({
      variables: {
        input: {
          ...details,
        },
      },
    });
  };

  return (
    <div className='container py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Gestion des détails du mariage</h1>
        <Link href='/admin'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          <p className='font-medium'>Erreur lors du chargement des détails du mariage</p>
          <p className='text-sm'>{error.message}</p>
        </div>
      )}

      {loading && !data ? (
        <div className='flex items-center justify-center p-12'>
          <div className='animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent'></div>
          <span className='ml-3'>Chargement des détails du mariage...</span>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Ceremony Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-xl'>
                <Calendar className='h-5 w-5 text-royal-600' />
                Détails de la cérémonie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Date de la cérémonie
                  </label>
                  <input
                    type='text'
                    name='ceremonyDate'
                    value={details.ceremonyDate}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='e.g., 29 Août , 2025'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Heure de la cérémonie
                  </label>
                  <input
                    type='text'
                    name='ceremonyTime'
                    value={details.ceremonyTime}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='e.g., 14h30'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Lieu de la cérémonie
                  </label>
                  <input
                    type='text'
                    name='ceremonyLocation'
                    value={details.ceremonyLocation}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='e.g., Église Saint Marie'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Adresse de la cérémonie
                  </label>
                  <input
                    type='text'
                    name='ceremonyAddress'
                    value={details.ceremonyAddress}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='Full address'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reception Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-xl'>
                <Clock className='h-5 w-5 text-royal-600' />
                Détails de la réception
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Heure de la réception
                  </label>
                  <input
                    type='text'
                    name='receptionTime'
                    value={details.receptionTime}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='e.g., 19h00'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Lieu de la réception
                  </label>
                  <input
                    type='text'
                    name='receptionLocation'
                    value={details.receptionLocation}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='e.g., Salle de réception La Florale'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Adresse de la réception
                  </label>
                  <input
                    type='text'
                    name='receptionAddress'
                    value={details.receptionAddress}
                    onChange={handleInputChange}
                    className='border rounded-md px-3 py-2 w-full'
                    placeholder='Full address'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-xl'>
                <Info className='h-5 w-5 text-royal-600' />
                Informations supplémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Message pour les invités
                </label>
                <textarea
                  name='additionalInfo'
                  value={details.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className='border rounded-md px-3 py-2 w-full'
                  placeholder='Toute information supplémentaire pour vos invités'
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-2xl font-bold mb-4 gradient-text'>
                  Détails du Programme
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='card-royal p-4 rounded-lg'>
                    <h4 className='text-xl font-bold mb-2 gradient-text'>
                      Bénédiction Nuptiale
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-3'>
                        <Calendar className='w-5 h-5 text-gold-500' />
                        <span>{details.ceremonyDate}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Clock className='w-5 h-5 text-gold-500' />
                        <span>{details.ceremonyTime}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <MapPin className='w-5 h-5 text-gold-500' />
                        <span>{details.ceremonyLocation}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <MapPin className='w-5 h-5 text-gold-500' />
                        <span className='text-gray-500'>
                          {details.ceremonyAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='card-royal p-4 rounded-lg'>
                    <h4 className='text-xl font-bold mb-2 gradient-text'>
                      Soirée de célébration à la Gloire de Dieu
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-3'>
                        <Calendar className='w-5 h-5 text-gold-500' />
                        <span>{details.ceremonyDate}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Clock className='w-5 h-5 text-gold-500' />
                        <span>{details.receptionTime}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <MapPin className='w-5 h-5 text-gold-500' />
                        <span>{details.receptionLocation}</span>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <MapPin className='w-5 h-5 text-gold-500' />
                        <span className='text-gray-500'>
                          {details.receptionAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-4 text-center'>
                  <p className='text-muted-foreground'>
                    {details.additionalInfo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className='flex justify-end'>
            <Button
              onClick={handleSave}
              disabled={updateLoading || !hasChanges}
              className='flex items-center gap-2'
            >
              {updateLoading ? (
                <>
                  <div className='animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent' />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
