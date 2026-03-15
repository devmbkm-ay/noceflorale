"use client";

import React from "react";
import { RsvpStats } from "@/graphql/rsvp";

interface DashboardOverviewProps {
  stats: RsvpStats;
  statsLoading: boolean;
  statsError: any;
}

export function DashboardOverview({ stats, statsLoading, statsError }: DashboardOverviewProps) {
  return (
    <div>
      <h1 className='text-2xl font-playfair font-bold mb-6'>
        Aperçu du Tableau de Bord
      </h1>

      {/* Error message for stats */}
      {statsError && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          <p className='font-medium'>
            Erreur lors du chargement des statistiques
          </p>
          <p className='text-sm'>
            {statsError.message ||
              "Impossible de charger les statistiques du tableau de bord. Veuillez réessayer."}
          </p>
        </div>
      )}

      {/* Stats cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500 mb-1'>Total des RSVPs</h3>
          <p className='text-2xl font-bold'>{stats.totalGuests}</p>
          {statsLoading && (
            <span className='text-xs text-gray-400'>Chargement...</span>
          )}
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500 mb-1'>Présents</h3>
          <p className='text-2xl font-bold text-green-600'>
            {stats.attending}
          </p>
          {statsLoading && (
            <span className='text-xs text-gray-400'>Chargement...</span>
          )}
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500 mb-1'>Absents</h3>
          <p className='text-2xl font-bold text-red-600'>
            {stats.notAttending}
          </p>
          {statsLoading && (
            <span className='text-xs text-gray-400'>Chargement...</span>
          )}
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500 mb-1'>
            Nombre Total d&apos;Invités
          </h3>
          <p className='text-2xl font-bold'>
            {stats.totalAdults + stats.totalChildren}
          </p>
          <div className='flex text-xs mt-1'>
            <span className='text-gray-500 mr-2'>
              Adultes: {stats.totalAdults}
            </span>
            <span className='text-gray-500'>
              Enfants: {stats.totalChildren}
            </span>
          </div>
          {statsLoading && (
            <span className='text-xs text-gray-400'>Chargement...</span>
          )}
        </div>
      </div>

      {/* Event participation stats */}
      <div className='bg-white p-6 rounded-lg shadow mb-8'>
        <h2 className='text-lg font-medium mb-4'>
          Participation aux Événements
        </h2>
        {statsError ? (
          <div className='p-4 bg-red-50 rounded-lg text-center'>
            <p className='text-red-600'>
              Impossible de charger les données de participation
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <p className='text-sm text-gray-500'>
                Cérémonie Uniquement
              </p>
              <p className='text-xl font-bold text-royal-600'>
                {stats.ceremonyOnly}
              </p>
              {statsLoading && (
                <span className='text-xs text-gray-400'>
                  Chargement...
                </span>
              )}
            </div>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <p className='text-sm text-gray-500'>
                Réception Uniquement
              </p>
              <p className='text-xl font-bold text-royal-600'>
                {stats.receptionOnly}
              </p>
              {statsLoading && (
                <span className='text-xs text-gray-400'>
                  Chargement...
                </span>
              )}
            </div>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <p className='text-sm text-gray-500'>Les Deux Événements</p>
              <p className='text-xl font-bold text-royal-600'>
                {stats.both}
              </p>
              {statsLoading && (
                <span className='text-xs text-gray-400'>
                  Chargement...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-medium mb-4'>RSVPs Récents</h2>
        {statsError ? (
          <p className='text-red-500'>
            Erreur lors du chargement des RSVPs récents:{" "}
            {statsError.message}
          </p>
        ) : stats.totalGuests === 0 ? (
          <p className='text-gray-500 italic'>
            Aucun RSVP soumis pour l&apos;instant.
          </p>
        ) : (
          <p className='text-gray-500 italic'>
            Les données RSVP récentes apparaîtront ici.
          </p>
        )}
      </div>
    </div>
  );
}
