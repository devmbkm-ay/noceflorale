import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EventParticipation } from "../types";
import {
  UserRound,
  Mail,
  Calendar,
  Heart,
  PartyPopper,
  Check,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const PartnerInfoStep: React.FC = () => {
  const { control } = useFormContext();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className='space-y-6'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div className='text-center mb-6' variants={itemVariants}>
        <h2 className='text-2xl font-bold text-primary'>Détails du Partenaire</h2>
        <p className='text-muted-foreground mt-1'>
          Veuillez fournir les informations de votre partenaire
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className='border-gold-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md'>
          <CardContent className='p-6'>
            <div className='grid gap-6'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name='primaryGuest.partnerFirstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom du Partenaire</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <UserRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                          <Input
                            className='pl-10'
                            placeholder="Prénom du partenaire"
                            {...field}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='primaryGuest.partnerLastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Partenaire</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <UserRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                          <Input
                            className='pl-10'
                            placeholder="Nom du partenaire"
                            {...field}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name='primaryGuest.partnerEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email du Partenaire</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          className='pl-10'
                          placeholder="Entrez l'email de votre partenaire"
                          type='email'
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name='primaryGuest.partnerTelephone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du Partenaire (Optionnel)</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          className='pl-10'
                          placeholder="Entrez le numéro de téléphone du partenaire"
                          type='tel'
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <p className='text-xs text-muted-foreground mt-1'>Format: +33 6 12 34 56 78 ou 06 12 34 56 78</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className='mt-6'>
        <div className='text-center mb-4'>
          <h3 className='text-xl font-medium text-primary'>
            Participation du Partenaire
          </h3>
          <p className='text-muted-foreground mt-1'>
            À quels événements votre partenaire assistera-t-il/elle ?
          </p>
        </div>

        <FormField
          control={control}
          name='primaryGuest.partnerEventParticipation'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className='grid grid-cols-1 md:grid-cols-3 gap-4'
                >
                  <Card
                    className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none ${
                      field.value === EventParticipation.BOTH
                        ? "border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                    }`}
                    onClick={() => field.onChange(EventParticipation.BOTH)}
                    tabIndex={0}
                    role='radio'
                    aria-checked={field.value === EventParticipation.BOTH}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        field.onChange(EventParticipation.BOTH);
                      }
                    }}
                  >
                    <CardContent className='p-6 flex flex-col items-center space-y-3'>
                      {field.value === EventParticipation.BOTH && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-2 right-2 bg-primary text-white rounded-full p-1'
                        >
                          <Check className='h-4 w-4' />
                        </motion.div>
                      )}
                      <div
                        className={`bg-primary/10 p-3 rounded-full transition-all ${
                          field.value === EventParticipation.BOTH
                            ? "bg-primary/20 scale-110"
                            : ""
                        }`}
                      >
                        <Heart className='h-6 w-6 text-primary' />
                      </div>
                      <div className='text-center'>
                        <RadioGroupItem
                          value={EventParticipation.BOTH}
                          id='partner-both-events'
                          className='sr-only'
                        />
                        <span
                          className={`text-lg font-semibold block mb-1 ${
                            field.value === EventParticipation.BOTH
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Journée Complète
                        </span>
                        <p className='font-normal text-sm text-muted-foreground'>
                          La cérémonie et la réception
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none ${
                      field.value === EventParticipation.BLESSING_ONLY
                        ? "border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                    }`}
                    onClick={() =>
                      field.onChange(EventParticipation.BLESSING_ONLY)
                    }
                    tabIndex={0}
                    role='radio'
                    aria-checked={
                      field.value === EventParticipation.BLESSING_ONLY
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        field.onChange(EventParticipation.BLESSING_ONLY);
                      }
                    }}
                  >
                    <CardContent className='p-6 flex flex-col items-center space-y-3'>
                      {field.value === EventParticipation.BLESSING_ONLY && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-2 right-2 bg-primary text-white rounded-full p-1'
                        >
                          <Check className='h-4 w-4' />
                        </motion.div>
                      )}
                      <div
                        className={`bg-primary/10 p-3 rounded-full transition-all ${
                          field.value === EventParticipation.BLESSING_ONLY
                            ? "bg-primary/20 scale-110"
                            : ""
                        }`}
                      >
                        <Calendar className='h-6 w-6 text-primary' />
                      </div>
                      <div className='text-center'>
                        <RadioGroupItem
                          value={EventParticipation.BLESSING_ONLY}
                          id='partner-blessing-only'
                          className='sr-only'
                        />
                        <span
                          className={`text-lg font-semibold block mb-1 ${
                            field.value === EventParticipation.BLESSING_ONLY
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Cérémonie Uniquement
                        </span>
                        <p className='font-normal text-sm text-muted-foreground'>
                          Uniquement la cérémonie de bénédiction
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none ${
                      field.value === EventParticipation.EVENING_ONLY
                        ? "border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                    }`}
                    onClick={() =>
                      field.onChange(EventParticipation.EVENING_ONLY)
                    }
                    tabIndex={0}
                    role='radio'
                    aria-checked={
                      field.value === EventParticipation.EVENING_ONLY
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        field.onChange(EventParticipation.EVENING_ONLY);
                      }
                    }}
                  >
                    <CardContent className='p-6 flex flex-col items-center space-y-3'>
                      {field.value === EventParticipation.EVENING_ONLY && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-2 right-2 bg-primary text-white rounded-full p-1'
                        >
                          <Check className='h-4 w-4' />
                        </motion.div>
                      )}
                      <div
                        className={`bg-primary/10 p-3 rounded-full transition-all ${
                          field.value === EventParticipation.EVENING_ONLY
                            ? "bg-primary/20 scale-110"
                            : ""
                        }`}
                      >
                        <PartyPopper className='h-6 w-6 text-primary' />
                      </div>
                      <div className='text-center'>
                        <RadioGroupItem
                          value={EventParticipation.EVENING_ONLY}
                          id='partner-evening-only'
                          className='sr-only'
                        />
                        <span
                          className={`text-lg font-semibold block mb-1 ${
                            field.value === EventParticipation.EVENING_ONLY
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Réception Uniquement
                        </span>
                        <p className='font-normal text-sm text-muted-foreground'>
                          Uniquement la réception du soir
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
};

export default PartnerInfoStep;
