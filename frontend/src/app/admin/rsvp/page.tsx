"use client";

import React, {
  useState,
  // useEffect
} from "react";
import {
  useQuery,
  // useMutation
} from "@apollo/client";
import { GET_ALL_RSVPS, GET_RSVP_STATS } from "@/graphql/rsvp";
// import {
//   AttendanceStatus,
//   EventParticipation
// } from "@/types/rsvp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import EventAttendanceBreakdown from "@/components/admin/EventAttendanceBreakdown";
import {
  BarChart3,
  Mail,
  Send,
  PieChart,
  Settings,
  Users,
  CheckCircle,
  XCircle,
  // Filter,
  // Search,
  Download,
  FileText,
  Calendar,
  Copy,
  CheckSquare,
} from "lucide-react";

export default function RsvpManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipientFilter, setRecipientFilter] = useState("all");

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_RSVP_STATS);
  const {
    data: rsvpsData,
    loading: rsvpsLoading,
    error: rsvpsError,
  } = useQuery(GET_ALL_RSVPS);

  const stats = statsData?.getRsvpStats || {
    totalGuests: 0,
    attending: 0,
    notAttending: 0,
    ceremonyOnly: 0,
    receptionOnly: 0,
    both: 0,
    totalAdults: 0,
    totalChildren: 0,
  };

  const rsvps = rsvpsData?.getAllRsvps || [];

  const handleSendTestEmail = () => {
    if (!emailSubject || !emailContent) {
      toast.error("Please enter both subject and content for the email");
      return;
    }

    toast.success("Test email sent successfully");
  };

  const handleSendBulkEmail = () => {
    if (!emailSubject || !emailContent || selectedRecipients.length === 0) {
      toast.error("Please complete all required fields");
      return;
    }

    toast.success(`Email sent to ${selectedRecipients.length} recipients`);
    setEmailSubject("");
    setEmailContent("");
    setSelectedRecipients([]);
  };

  const handleSelectAllRecipients = () => {
    if (rsvps.length === selectedRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(rsvps.map((rsvp: { id: string }) => rsvp.id));
    }
  };

  const handleToggleRecipient = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(
        selectedRecipients.filter((recipientId) => recipientId !== id)
      );
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  const filteredRsvps = React.useMemo(() => {
    switch (recipientFilter) {
      case "attending":
        return rsvps.filter(
          (rsvp: { attending: string }) => rsvp.attending === "attending"
        );
      case "not_attending":
        return rsvps.filter(
          (rsvp: { attending: string }) => rsvp.attending === "not_attending"
        );
      case "pending":
        return rsvps.filter((rsvp: { attending: string }) => !rsvp.attending);
      case "ceremony":
        return rsvps.filter(
          (rsvp: { eventParticipation: string }) =>
            rsvp.eventParticipation === "blessing_only" ||
            rsvp.eventParticipation === "both"
        );
      case "reception":
        return rsvps.filter(
          (rsvp: { eventParticipation: string }) =>
            rsvp.eventParticipation === "evening_only" ||
            rsvp.eventParticipation === "both"
        );
      default:
        return rsvps;
    }
  }, [rsvps, recipientFilter]);

  const copyRsvpLink = () => {
    const link = `${window.location.origin}/rsvp`;
    navigator.clipboard.writeText(link);
    toast.success("RSVP link copied to clipboard!");
  };

  const downloadRsvpSummary = () => {
    // Implementation would generate a PDF/report with RSVP stats
    toast.success("RSVP summary report downloading");
  };

  const rsvpDeadlinePassed = () => {
    // This would actually check against a configured deadline
    return false;
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-playfair font-bold'>Gestion des RSVP</h1>

      {/* Capacity Alert Banner */}
      {!statsLoading && stats && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            stats.totalGuests / stats.maxCapacity > 0.9
              ? "bg-red-100 border border-red-300"
              : stats.totalGuests / stats.maxCapacity > 0.75
              ? "bg-orange-100 border border-orange-300"
              : "bg-green-100 border border-green-300"
          }`}
        >
          <div className='flex items-center'>
            <div
              className={`p-2 rounded-full mr-3 ${
                stats.totalGuests / stats.maxCapacity > 0.9
                  ? "bg-red-200"
                  : stats.totalGuests / stats.maxCapacity > 0.75
                  ? "bg-orange-200"
                  : "bg-green-200"
              }`}
            >
              {stats.totalGuests / stats.maxCapacity > 0.9 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              ) : stats.totalGuests / stats.maxCapacity > 0.75 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              )}
            </div>
            <div>
              <h3
                className={`font-bold ${
                  stats.totalGuests / stats.maxCapacity > 0.9
                    ? "text-red-800"
                    : stats.totalGuests / stats.maxCapacity > 0.75
                    ? "text-orange-800"
                    : "text-green-800"
                }`}
              >
                {stats.totalGuests / stats.maxCapacity > 0.9
                  ? "Capacité presque atteinte !"
                  : stats.totalGuests / stats.maxCapacity > 0.75
                  ? "Capacité modérée"
                  : "Capacité d'accueil"}
              </h3>
              <p
                className={`text-sm ${
                  stats.totalGuests / stats.maxCapacity > 0.9
                    ? "text-red-700"
                    : stats.totalGuests / stats.maxCapacity > 0.75
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
              >
                {stats.totalGuests} invités confirmés sur {stats.maxCapacity} (
                {Math.round((stats.totalGuests / stats.maxCapacity) * 100)}%) -{" "}
                {stats.maxCapacity - stats.totalGuests} places restantes
              </p>
            </div>
          </div>
          <div>
            <Button
              variant='outline'
              className={`${
                stats.totalGuests / stats.maxCapacity > 0.9
                  ? "border-red-400 text-red-700 hover:bg-red-50"
                  : stats.totalGuests / stats.maxCapacity > 0.75
                  ? "border-orange-400 text-orange-700 hover:bg-orange-50"
                  : "border-green-400 text-green-700 hover:bg-green-50"
              }`}
              onClick={() => refetchStats()}
            >
              Actualiser
            </Button>
          </div>
        </div>
      )}

      <Tabs
        defaultValue='overview'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='mb-6'>
          <TabsTrigger value='overview' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            <span>Aperçu</span>
          </TabsTrigger>
          <TabsTrigger
            value='communications'
            className='flex items-center gap-2'
          >
            <Mail className='h-4 w-4' />
            <span>Communications</span>
          </TabsTrigger>
          <TabsTrigger
            value='configuration'
            className='flex items-center gap-2'
          >
            <Settings className='h-4 w-4' />
            <span>Configuration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          {/* Event Attendance Breakdown */}
          {!rsvpsLoading &&
            !rsvpsError &&
            rsvps.length > 0 &&
            statsData?.getRsvpStats && (
              <EventAttendanceBreakdown
                rsvps={rsvps}
                stats={statsData.getRsvpStats}
              />
            )}
          {/* RSVP Statistics Dashboard */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
              <PieChart className='h-5 w-5 text-royal-600' />
              Statistiques RSVP
            </h2>

            {statsError ? (
              <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
                Erreur lors du chargement des statistiques :{" "}
                {statsError.message}
              </div>
            ) : statsLoading ? (
              <div className='flex justify-center p-6'>
                <div className='animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent'></div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>
                    Total des invités
                  </h3>
                  <p className='text-2xl font-bold'>
                    {stats.totalGuests} / {stats.maxCapacity}
                    <span className='text-sm ml-2 text-gray-500'>
                      (
                      {Math.round(
                        (stats.totalGuests / stats.maxCapacity) * 100
                      )}
                      %)
                    </span>
                  </p>
                  <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
                    <div
                      className={`h-2.5 rounded-full ${
                        stats.totalGuests / stats.maxCapacity > 0.9
                          ? "bg-red-600"
                          : stats.totalGuests / stats.maxCapacity > 0.75
                          ? "bg-orange-500"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (stats.totalGuests / stats.maxCapacity) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    {stats.maxCapacity - stats.totalGuests} places disponibles
                    {stats.totalGuests / stats.maxCapacity > 0.9 &&
                      " (Presque complet)"}
                  </p>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    <div className='bg-green-50 p-2 rounded text-center'>
                      <p className='text-xs text-green-700'>Adultes</p>
                      <p className='font-bold text-green-700'>
                        {stats.totalAdults}
                      </p>
                    </div>
                    <div className='bg-blue-50 p-2 rounded text-center'>
                      <p className='text-xs text-blue-700'>Enfants</p>
                      <p className='font-bold text-blue-700'>
                        {stats.totalChildren}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className='bg-green-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>Présents</h3>
                  <p className='text-2xl font-bold text-green-600'>
                    {stats.attending}
                    {console.log("Stat attending from admin/rsvp :", { stats })}
                  </p>
                </div> */}
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>
                    Taux de présence
                  </h3>
                  <p className='text-2xl font-bold text-blue-600'>
                    {stats.attending > 0
                      ? Math.round(
                          (stats.totalGuests / stats.maxCapacity) * 100
                        )
                      : 0}
                    %
                  </p>
                  <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
                    <div
                      className={`h-2.5 rounded-full ${
                        stats.attending / stats.maxCapacity > 0.75
                          ? "bg-blue-600"
                          : "bg-blue-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (stats.attending / stats.maxCapacity) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    {stats.totalGuests} sur {stats.maxCapacity} maximum
                  </p>
                </div>
                <div className='bg-red-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>Absents</h3>
                  <p className='text-2xl font-bold text-red-600'>
                    {stats.notAttending}
                  </p>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>
                    Cérémonie uniquement
                  </h3>
                  <p className='text-2xl font-bold text-blue-600'>
                    {stats.ceremonyOnly}
                  </p>
                </div>
                <div className='bg-purple-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>
                    Réception uniquement
                  </h3>
                  <p className='text-2xl font-bold text-purple-600'>
                    {stats.receptionOnly}
                  </p>
                </div>
                <div className='bg-amber-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>
                    Les deux événements
                  </h3>
                  <p className='text-2xl font-bold text-amber-600'>
                    {stats.both}
                    {console.log("Stats data :", stats)}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>Total adultes</h3>
                  <p className='text-2xl font-bold'>{stats.totalAdults}</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-sm text-gray-500 mb-1'>Total enfants</h3>
                  <p className='text-2xl font-bold'>{stats.totalChildren}</p>
                </div>
              </div>
            )}

            <div className='mt-6 flex flex-wrap gap-3'>
              <Button
                variant='outline'
                className='flex items-center gap-2'
                onClick={downloadRsvpSummary}
              >
                <Download className='h-4 w-4' />
                Télécharger le résumé
              </Button>
              <Button
                variant='outline'
                className='flex items-center gap-2'
                onClick={() => refetchStats()}
              >
                <Calendar className='h-4 w-4' />
                Actualiser les statistiques
              </Button>
            </div>
          </Card>

          {/* Recent RSVP Activity */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
              <FileText className='h-5 w-5 text-royal-600' />
              Activité RSVP récente
            </h2>

            {rsvpsError ? (
              <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
                Erreur lors du chargement des RSVP : {rsvpsError.message}
              </div>
            ) : rsvpsLoading ? (
              <div className='flex justify-center p-6'>
                <div className='animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent'></div>
              </div>
            ) : rsvps.length === 0 ? (
              <div className='text-center p-6 text-gray-500'>
                Aucune activité RSVP pour l&apos;instant.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Nom
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Statut
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Événement
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date de soumission
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {rsvps.slice(0, 5).map(
                      (rsvp: {
                        id: string;
                        // name: string;
                        firstName: string;
                        lastName: string;
                        attending: string;
                        eventParticipation: string;
                        createdAt: string;
                      }) => (
                        <tr key={rsvp.id} className='hover:bg-gray-50'>
                          <td className='px-4 py-3'>
                            {rsvp.firstName} {rsvp.lastName}
                          </td>
                          <td className='px-4 py-3'>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                rsvp.attending === "attending"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rsvp.attending === "attending" ? (
                                <CheckCircle className='h-3 w-3 mr-1' />
                              ) : (
                                <XCircle className='h-3 w-3 mr-1' />
                              )}
                              {rsvp.attending === "attending"
                                ? "Présent"
                                : "Absent"}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            {rsvp.eventParticipation === "both"
                              ? "Les deux événements"
                              : rsvp.eventParticipation === "blessing_only"
                              ? "Cérémonie uniquement"
                              : rsvp.eventParticipation === "evening_only"
                              ? "Réception uniquement"
                              : "Aucun"}
                          </td>
                          <td className='px-4 py-3 text-gray-500 text-sm'>
                            {new Date(rsvp.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {rsvps.length > 5 && (
                  <div className='mt-4 text-center'>
                    <Button
                      variant='link'
                      onClick={() => setActiveTab("communications")}
                    >
                      Voir tous les RSVP
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='communications' className='space-y-6'>
          {/* Email Communication Module */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
              <Mail className='h-5 w-5 text-royal-600' />
              Communication par email
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Objet de l&apos;email
                    </label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Saisissez l'objet de l'email"
                      className='w-full'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Contenu de l&apos;email
                    </label>
                    <Textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder='Rédigez le contenu de votre email ici...'
                      className='w-full min-h-[200px]'
                    />
                  </div>

                  <div className='flex gap-3'>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                      onClick={handleSendTestEmail}
                      disabled={!emailSubject || !emailContent}
                    >
                      <Send className='h-4 w-4' />
                      Envoyer un email test
                    </Button>

                    <Button
                      className='flex items-center gap-2'
                      onClick={handleSendBulkEmail}
                      disabled={
                        !emailSubject ||
                        !emailContent ||
                        selectedRecipients.length === 0
                      }
                    >
                      <Send className='h-4 w-4' />
                      Envoyer à {selectedRecipients.length} destinataires
                    </Button>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-1'>
                <div className='bg-gray-50 p-4 rounded-lg mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-medium'>Destinataires</h3>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='flex items-center gap-1 text-xs h-7 px-2'
                        onClick={handleSelectAllRecipients}
                      >
                        <CheckSquare className='h-3 w-3' />
                        {selectedRecipients.length === rsvps.length
                          ? "Tout désélectionner"
                          : "Tout sélectionner"}
                      </Button>
                    </div>
                  </div>

                  <div className='flex gap-2 mb-3'>
                    <select
                      className='text-xs border rounded px-2 py-1'
                      value={recipientFilter}
                      onChange={(e) => setRecipientFilter(e.target.value)}
                    >
                      <option value='all'>Tous les invités</option>
                      <option value='attending'>Présents</option>
                      <option value='not_attending'>Absents</option>
                      <option value='pending'>En attente</option>
                      <option value='ceremony'>Invités à la cérémonie</option>
                      <option value='reception'>Invités à la réception</option>
                    </select>
                    <span className='text-xs text-gray-500 py-1'>
                      {filteredRsvps.length} invités
                    </span>
                  </div>

                  <div className='overflow-y-auto max-h-[260px] space-y-1'>
                    {filteredRsvps.length === 0 ? (
                      <p className='text-sm text-gray-500 italic'>
                        Aucun destinataire correspondant
                      </p>
                    ) : (
                      filteredRsvps.map(
                        (rsvp: {
                          id: string;
                          // name: string;
                          firstName: string;
                          lastName: string;
                          attending: string;
                        }) => (
                          <div
                            key={rsvp.id}
                            className='flex items-center gap-2 text-sm p-1 rounded hover:bg-gray-100'
                          >
                            <input
                              type='checkbox'
                              checked={selectedRecipients.includes(rsvp.id)}
                              onChange={() => handleToggleRecipient(rsvp.id)}
                              className='h-4 w-4'
                            />
                            <span className='truncate'>
                              {rsvp.firstName} {rsvp.lastName}
                            </span>
                            <span className='text-xs text-gray-500'>
                              {rsvp.attending === "attending" ? (
                                <CheckCircle className='h-3 w-3 text-green-500' />
                              ) : (
                                <XCircle className='h-3 w-3 text-red-500' />
                              )}
                            </span>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-medium mb-2'>Modèles d&apos;email</h3>
                  <div className='space-y-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-left'
                      onClick={() => {
                        setEmailSubject("Wedding RSVP Confirmation");
                        setEmailContent(
                          "Thank you for confirming your attendance to our wedding. We're excited to celebrate with you!"
                        );
                      }}
                    >
                      Confirmation RSVP
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-left'
                      onClick={() => {
                        setEmailSubject("Wedding Reminder - One Week To Go!");
                        setEmailContent(
                          "Our wedding is only one week away! Here are some important details to help you prepare for the big day."
                        );
                      }}
                    >
                      Rappel de mariage
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-left'
                      onClick={() => {
                        setEmailSubject("Important Update About Our Wedding");
                        setEmailContent(
                          "We wanted to inform you about an important update regarding our wedding."
                        );
                      }}
                    >
                      Mise à jour importante
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* RSVP List */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
              <Users className='h-5 w-5 text-royal-600' />
              Liste des RSVP
            </h2>

            {rsvpsError ? (
              <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
                Erreur lors du chargement des RSVP : {rsvpsError.message}
              </div>
            ) : rsvpsLoading ? (
              <div className='flex justify-center p-6'>
                <div className='animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent'></div>
              </div>
            ) : rsvps.length === 0 ? (
              <div className='text-center p-6 text-gray-500'>
                Aucune réponse RSVP pour l&apos;instant.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Nom
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Prénom
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Statut
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Événement
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Type d&apos;invité
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date de soumission
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {rsvps.map(
                      (rsvp: {
                        partnerName: boolean;
                        id: string;
                        // name: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        attending: string;
                        eventParticipation: string;
                        guestType: string;
                        hasChildren: boolean;
                        children?: {
                          id: string;
                          name: string;
                          age: number;
                        }[];
                        createdAt: string | number | Date;
                      }) => (
                        <tr key={rsvp.id} className='hover:bg-gray-50'>
                          <td className='px-4 py-3'>
                            {rsvp.firstName} {rsvp.lastName}
                          </td>
                          <td className='px-4 py-3 text-gray-500'>
                            {rsvp.email}
                          </td>
                          <td className='px-4 py-3'>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                rsvp.attending === "attending"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rsvp.attending === "attending" ? (
                                <CheckCircle className='h-3 w-3 mr-1' />
                              ) : (
                                <XCircle className='h-3 w-3 mr-1' />
                              )}
                              {rsvp.attending === "attending"
                                ? "Présent"
                                : "Absent"}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            {rsvp.eventParticipation === "both"
                              ? "Les deux événements"
                              : rsvp.eventParticipation === "blessing_only"
                              ? "Cérémonie uniquement"
                              : rsvp.eventParticipation === "evening_only"
                              ? "Réception uniquement"
                              : "Aucun"}
                          </td>
                          <td className='px-4 py-3 text-gray-500'>
                            <div className='flex flex-col'>
                              <span>
                                {rsvp.guestType === "single"
                                  ? "Seul"
                                  : "Couple"}
                              </span>
                              {rsvp.guestType === "couple" &&
                                rsvp.partnerName && (
                                  <span className='text-xs font-medium text-royal-600 mt-1'>
                                    Partenaire : {rsvp.partnerName}
                                  </span>
                                )}
                              {rsvp.hasChildren &&
                                rsvp.children &&
                                rsvp.children.length > 0 && (
                                  <span className='text-xs mt-1'>
                                    + {rsvp.children.length}{" "}
                                    {rsvp.children.length === 1
                                      ? "enfant"
                                      : "enfants"}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className='px-4 py-3 text-gray-500 text-sm'>
                            {new Date(rsvp.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='configuration' className='space-y-6'>
          {/* RSVP Configuration */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
              <Settings className='h-5 w-5 text-royal-600' />
              Configuration RSVP
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Date limite RSVP
                  </h3>
                  <div className='flex items-center gap-3'>
                    <Input
                      type='date'
                      defaultValue='2023-12-31'
                      className='w-full'
                    />
                    <Button variant='outline' size='sm'>
                      Mettre à jour
                    </Button>
                  </div>
                  {rsvpDeadlinePassed() && (
                    <p className='text-red-500 text-sm mt-1'>
                      La date limite RSVP est passée
                    </p>
                  )}
                </div>

                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Statut du formulaire RSVP
                  </h3>
                  <div className='flex items-center gap-2'>
                    <select className='border rounded-md px-3 py-2'>
                      <option value='open'>Ouvert</option>
                      <option value='closed'>Fermé</option>
                      <option value='invite_only'>
                        Sur invitation uniquement
                      </option>
                    </select>
                    <Button variant='outline' size='sm'>
                      Mettre à jour
                    </Button>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    Contrôle qui peut accéder au formulaire RSVP
                  </p>
                </div>

                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Email de réponse automatique
                  </h3>
                  <div className='flex items-center gap-2'>
                    <select className='border rounded-md px-3 py-2'>
                      <option value='enabled'>Activé</option>
                      <option value='disabled'>Désactivé</option>
                    </select>
                    <Button variant='outline' size='sm'>
                      Mettre à jour
                    </Button>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    Envoyer automatiquement un email de confirmation lorsque les
                    invités répondent
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Lien de la page RSVP
                  </h3>
                  <div className='flex items-center gap-2'>
                    <Input
                      value={`${window.location.origin}/rsvp`}
                      readOnly
                      className='w-full'
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={copyRsvpLink}
                      className='flex items-center gap-1'
                    >
                      <Copy className='h-4 w-4' />
                      Copier
                    </Button>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    Partagez ce lien avec vos invités
                  </p>
                </div>

                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Code d&pos;accès à l&apos;invitation
                  </h3>
                  <div className='flex items-center gap-2'>
                    <Input
                      placeholder="Créer un code d'accès"
                      defaultValue='NELANDSID2023'
                      className='w-full'
                    />
                    <Button variant='outline' size='sm'>
                      Mettre à jour
                    </Button>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    Code optionnel pour que les invités accèdent au formulaire
                    RSVP
                  </p>
                </div>

                <div>
                  <h3 className='text-base font-medium mb-2'>
                    Paramètres d&apos;email
                  </h3>
                  <div>
                    <div className='flex items-center mb-2'>
                      <input
                        type='checkbox'
                        id='notify-new-rsvp'
                        className='mr-2'
                        defaultChecked
                      />
                      <label htmlFor='notify-new-rsvp' className='text-sm'>
                        Me prévenir lorsqu&apos;un nouveau RSVP est soumis
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='weekly-digest'
                        className='mr-2'
                      />
                      <label htmlFor='weekly-digest' className='text-sm'>
                        M&apos;envoyer un résumé hebdomadaire des RSVP
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Customization */}
          <Card className='p-6'>
            <h2 className='text-xl font-medium mb-4'>
              Personnalisation du formulaire
            </h2>

            <div className='space-y-4'>
              <div>
                <h3 className='text-base font-medium mb-2'>
                  Messages personnalisés
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>
                      Message de bienvenue
                    </label>
                    <Textarea
                      defaultValue="We're excited to celebrate our special day with you! Please let us know if you can make it."
                      className='h-24'
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>
                      Message de confirmation
                    </label>
                    <Textarea
                      defaultValue='Thank you for your response! We look forward to celebrating with you.'
                      className='h-24'
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-base font-medium mb-2'>
                  Champs du formulaire
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between bg-gray-50 p-3 rounded'>
                    <span>Exigences alimentaires</span>
                    <div className='flex items-center gap-2'>
                      <select className='text-sm border rounded px-2 py-1'>
                        <option value='optional'>Optionnel</option>
                        <option value='required'>Requis</option>
                        <option value='hidden'>Masqué</option>
                      </select>
                    </div>
                  </div>
                  <div className='flex items-center justify-between bg-gray-50 p-3 rounded'>
                    <span>Demandes de chansons</span>
                    <div className='flex items-center gap-2'>
                      <select className='text-sm border rounded px-2 py-1'>
                        <option value='optional'>Optionnel</option>
                        <option value='required'>Requis</option>
                        <option value='hidden'>Masqué</option>
                      </select>
                    </div>
                  </div>
                  <div className='flex items-center justify-between bg-gray-50 p-3 rounded'>
                    <span>Notes supplémentaires</span>
                    <div className='flex items-center gap-2'>
                      <select className='text-sm border rounded px-2 py-1'>
                        <option value='optional'>Optionnel</option>
                        <option value='required'>Requis</option>
                        <option value='hidden'>Masqué</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button className='flex items-center gap-2'>
                  <Settings className='h-4 w-4' />
                  Enregistrer la configuration
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
