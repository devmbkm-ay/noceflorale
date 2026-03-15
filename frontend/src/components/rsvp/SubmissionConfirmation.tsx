import React from 'react';
import { CheckCircle2, Calendar, MapPin, PartyPopper } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

interface SubmissionConfirmationProps {
  guestName: string;
  resetForm: () => void;
}

const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({
  guestName,
  resetForm,
}) => {
  return (
    <div className="space-y-6 py-8 px-4 md:px-0">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary">
          Merci, {guestName} !
        </h2>
        <p className="text-muted-foreground max-w-md">
          Votre RSVP a été soumis avec succès. Nous sommes ravis de célébrer
          ce jour spécial avec vous !
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-md">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Détails de l&apos;événement</h3>
                <p className="text-sm text-muted-foreground">
                  Samedi 7 octobre 2023
                </p>
                <p className="text-sm text-muted-foreground">
                  Cérémonie de bénédiction : 14h00 | Réception en soirée : 18h00
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Lieu</h3>
                <p className="text-sm text-muted-foreground">
                  Salle de mariage Noce Florale
                </p>
                <p className="text-sm text-muted-foreground">
                  123 Allée des Mariages, Ville, Pays
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <PartyPopper className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Prochaines étapes</h3>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez prochainement un email de confirmation avec tous les détails.
                  Nous avons hâte de célébrer avec vous !
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-background/80 px-6 py-4">
          <Button onClick={resetForm} variant="outline" className="mx-auto">
            Soumettre une autre réponse
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionConfirmation;
