import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SEND_FEEDBACK_TO_GUEST } from "@/graphql/rsvp";
import { Rsvp } from "@/graphql/rsvp";
import { Mail, Send, X, AlertCircle, CheckCircle } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Rsvp | null;
}

export function FeedbackModal({ isOpen, onClose, guest }: FeedbackModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("Équipe Noce Florale");

  const [sendFeedback, { loading: sendingFeedback }] = useMutation(SEND_FEEDBACK_TO_GUEST, {
    onCompleted: (data) => {
      if (data.sendFeedbackToGuest.success) {
        toast.success("Message envoyé avec succès!", {
          description: `Le message a été envoyé à ${guest?.firstName} ${guest?.lastName}`,
        });
        handleClose();
      } else {
        toast.error("Erreur lors de l'envoi", {
          description: data.sendFeedbackToGuest.error,
        });
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi", {
        description: error.message,
      });
    },
  });

  // Predefined message templates
  const messageTemplates = [
    {
      id: "confirmation",
      label: "Confirmation de présence",
      subject: "Confirmation de votre présence à notre mariage",
      message: `Cher(e) ${guest?.firstName},

Nous avons bien reçu votre confirmation de présence à notre mariage et nous sommes ravis de célébrer ce jour spécial avec vous !

Nous vous enverrons bientôt plus de détails concernant la cérémonie et la réception.

Merci encore de partager ce moment unique avec nous.`,
    },
    {
      id: "reminder",
      label: "Rappel du mariage",
      subject: "Rappel - Notre mariage approche !",
      message: `Bonjour ${guest?.firstName},

Notre grand jour approche à grands pas et nous avons hâte de vous retrouver !

Voici quelques informations importantes pour préparer votre venue :
- Date et heure : [À préciser]
- Lieu : [À préciser]
- Code vestimentaire : [À préciser]

N'hésitez pas à nous contacter si vous avez des questions.`,
    },
    {
      id: "thanks",
      label: "Remerciements",
      subject: "Merci pour votre présence à notre mariage",
      message: `Cher(e) ${guest?.firstName},

Nous tenions à vous remercier chaleureusement pour votre présence à notre mariage. Votre présence a rendu cette journée encore plus spéciale.

Nous espérons que vous avez passé un moment aussi merveilleux que nous.

Avec toute notre affection,`,
    },
    {
      id: "update",
      label: "Mise à jour importante",
      subject: "Mise à jour importante concernant notre mariage",
      message: `Bonjour ${guest?.firstName},

Nous espérons que vous allez bien. Nous vous écrivons pour vous informer d'une mise à jour importante concernant notre mariage.

[Détails de la mise à jour à préciser]

Merci de votre compréhension et n'hésitez pas à nous contacter si vous avez des questions.`,
    },
  ];

  const handleSend = async () => {
    if (!guest || !subject.trim() || !message.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      await sendFeedback({
        variables: {
          input: {
            guestId: guest.id,
            subject: subject.trim(),
            message: message.trim(),
            fromName: fromName.trim() || "Équipe Noce Florale",
          },
        },
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSubject(template.subject);
    setMessage(template.message);
  };

  const handleClose = () => {
    setSubject("");
    setMessage("");
    setFromName("Équipe Noce Florale");
    onClose();
  };

  if (!guest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-royal-600" />
            Envoyer un message à {guest.firstName} {guest.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Guest info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Destinataire</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                {guest.attending === "attending" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span>
                  {guest.attending === "attending" ? "Présent" : "Absent"}
                </span>
              </div>
            </div>

            {/* From name */}
            <div className="space-y-2">
              <Label htmlFor="fromName">Nom de l'expéditeur</Label>
              <Input
                id="fromName"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Équipe Noce Florale"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Objet du message <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Entrez l'objet de votre message"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message ici..."
                className="min-h-[200px]"
                required
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSend}
                disabled={sendingFeedback || !subject.trim() || !message.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sendingFeedback ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={sendingFeedback}>
                Annuler
              </Button>
            </div>
          </div>

          {/* Templates sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Modèles de messages</h3>
              <div className="space-y-2">
                {messageTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div>
                      <div className="font-medium text-sm">{template.label}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {template.subject}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Information</p>
                  <p>
                    Le message sera envoyé par email avec un design professionnel
                    aux couleurs de votre mariage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
