import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Edit } from "lucide-react";
import { AttendanceStatus, EventParticipation, GuestType } from "../types";

// Component for displaying a section of the summary
const SummarySection = ({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: {
    label: string;
    value: string | number | boolean | React.ReactNode;
  }[];
  onEdit: () => void;
}) => {
  return (
    <Card className="border-gold-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-royal-50 p-4 flex justify-between items-center border-b border-gold-200">
          <h3 className="font-medium text-royal-700">{title}</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-royal-500 hover:text-royal-700 hover:bg-royal-100 flex items-center gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Modifier</span>
          </Button>
        </div>
        <div className="p-4">
          <dl className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <dt className="font-medium text-gray-600">{item.label}:</dt>
                <dd className="text-gray-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewStep: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const primaryGuest = watch("primaryGuest");

  // Format the event participation for display
  const formatEventParticipation = (participation: EventParticipation) => {
    switch (participation) {
      case EventParticipation.BOTH:
        return "Cérémonie & Réception";
      case EventParticipation.BLESSING_ONLY:
        return "Cérémonie Uniquement";
      case EventParticipation.EVENING_ONLY:
        return "Réception Uniquement";
      default:
        return "Inconnu";
    }
  };

  // Navigate to a specific step
  const goToStep = (step: number) => {
    setValue("currentStep", step);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Vérifiez Votre RSVP</h2>
        <p className="text-muted-foreground mt-1">
          Veuillez vérifier vos informations avant de soumettre
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        <SummarySection
          title="Vos Informations"
          onEdit={() => goToStep(0)}
          items={[
            { label: "Nom", value: `${primaryGuest.firstName || ''} ${primaryGuest.lastName || ''}`.trim() },
            { label: "Email", value: primaryGuest.email },
            { label: "Téléphone", value: primaryGuest.telephone || "Non fourni" },
            {
              label: "Présence",
              value:
                primaryGuest.attending === AttendanceStatus.YES ? "Oui" : "Non",
            },
          ]}
        />

        {/* Only show these sections if attending */}
        {primaryGuest.attending === AttendanceStatus.YES && (
          <>
            {/* Event Participation */}
            <SummarySection
              title="Participation à l'Événement"
              onEdit={() => goToStep(1)}
              items={[
                {
                  label: "Présence",
                  value: formatEventParticipation(
                    primaryGuest.eventParticipation
                  ),
                },
              ]}
            />

            {/* Guest Type */}
            <SummarySection
              title="Informations sur l'Invité"
              onEdit={() => goToStep(2)}
              items={[
                {
                  label: "Vient en tant que",
                  value:
                    primaryGuest.guestType === GuestType.SINGLE
                      ? "Invité Seul"
                      : "Couple",
                },
              ]}
            />

            {/* Partner Information - Only if attending as couple */}
            {primaryGuest.guestType === GuestType.COUPLE && (
              <SummarySection
                title="Informations du Partenaire"
                onEdit={() => goToStep(3)}
                items={[
                  {
                    label: "Nom du Partenaire",
                    value: primaryGuest.partnerFirstName && primaryGuest.partnerLastName 
                      ? `${primaryGuest.partnerFirstName} ${primaryGuest.partnerLastName}`
                      : primaryGuest.partnerName || "Non fourni",
                  },
                  {
                    label: "Email du Partenaire",
                    value: primaryGuest.partnerEmail || "Non fourni",
                  },
                  {
                    label: "Participation du Partenaire",
                    value: primaryGuest.partnerEventParticipation
                      ? formatEventParticipation(
                          primaryGuest.partnerEventParticipation
                        )
                      : "Même que vous",
                  },
                ]}
              />
            )}

            {/* Children Information */}
            <SummarySection
              title="Informations des Enfants"
              onEdit={() => goToStep(4)}
              items={[
                {
                  label: "Avec Enfants",
                  value: primaryGuest.hasChildren ? "Oui" : "Non",
                },
                ...(primaryGuest.hasChildren
                  ? [
                      {
                        label: "Nombre d'Enfants",
                        value: primaryGuest.childrenCount || 0,
                      },
                    ]
                  : []),
                ...(primaryGuest.hasChildren &&
                primaryGuest.children &&
                primaryGuest.children.length > 0
                  ? primaryGuest.children.map(
                      (child: { name: string; age: number }, idx: number) => ({
                        label: `Enfant ${idx + 1}`,
                        value: `${child.name} (${child.age} ans)`,
                      })
                    )
                  : []),
              ]}
            />
          </>
        )}
      </div>

      <div className="pt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Veuillez vérifier toutes les informations ci-dessus avant de soumettre votre RSVP. Vous
          pouvez modifier une section en cliquant sur le bouton &quot;Modifier&quot;.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
