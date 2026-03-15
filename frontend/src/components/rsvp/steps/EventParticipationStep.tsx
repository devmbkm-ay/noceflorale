import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, PartyPopper, Heart, Check } from "lucide-react";
import { EventParticipation } from "../types";
import { motion } from "framer-motion";

const EventParticipationStep: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-primary'>Participation aux Événements</h2>
        <p className='text-muted-foreground mt-1'>
          Veuillez sélectionner à quelles parties de notre journée spéciale vous assisterez
        </p>
      </div>

      <FormField
        control={control}
        name='primaryGuest.eventParticipation'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
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
                      className={`bg-primary/10 p-3 rounded-full transition-all duration-200 ${
                        field.value === EventParticipation.BOTH
                          ? "bg-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      <Heart
                        className={`h-6 w-6 text-primary transition-all ${
                          field.value === EventParticipation.BOTH
                            ? "scale-110"
                            : ""
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <RadioGroupItem
                        value={EventParticipation.BOTH}
                        id='both-events'
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
                        La cérémonie de bénédiction et la réception du soir
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
                      className={`bg-primary/10 p-3 rounded-full transition-all duration-200 ${
                        field.value === EventParticipation.BLESSING_ONLY
                          ? "bg-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      <Calendar
                        className={`h-6 w-6 text-primary transition-all ${
                          field.value === EventParticipation.BLESSING_ONLY
                            ? "scale-110"
                            : ""
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <RadioGroupItem
                        value={EventParticipation.BLESSING_ONLY}
                        id='blessing-only'
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
                  aria-checked={field.value === EventParticipation.EVENING_ONLY}
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
                      className={`bg-primary/10 p-3 rounded-full transition-all duration-200 ${
                        field.value === EventParticipation.EVENING_ONLY
                          ? "bg-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      <PartyPopper
                        className={`h-6 w-6 text-primary transition-all ${
                          field.value === EventParticipation.EVENING_ONLY
                            ? "scale-110"
                            : ""
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <RadioGroupItem
                        value={EventParticipation.EVENING_ONLY}
                        id='evening-only'
                        className='sr-only'
                      />
                      <span
                        className={`text-lg font-semibold block mb-1 ${
                          field.value === EventParticipation.EVENING_ONLY
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        Soirée Uniquement
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
    </div>
  );
};

export default EventParticipationStep;
