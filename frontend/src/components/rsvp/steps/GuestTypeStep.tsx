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
import { User, Users, Check } from "lucide-react";
import { GuestType } from "../types";
import { motion } from "framer-motion";

const GuestTypeStep: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-primary'>Informations sur l&apos;Invité</h2>
        <p className='text-muted-foreground mt-1'>
          Veuillez nous indiquer si vous venez seul(e) ou avec un(e) partenaire
        </p>
      </div>

      <FormField
        control={control}
        name='primaryGuest.guestType'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ''}
                className='grid grid-cols-1 md:grid-cols-2 gap-4'
              >
                <Card
                  className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none ${
                    field.value === GuestType.SINGLE
                      ? "border-primary bg-primary/5 shadow-md"
                      : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                  }`}
                  onClick={() => field.onChange(GuestType.SINGLE)}
                  tabIndex={0}
                  role='radio'
                  aria-checked={field.value === GuestType.SINGLE}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      field.onChange(GuestType.SINGLE);
                    }
                  }}
                >
                  <CardContent className='p-6 flex flex-col items-center space-y-3'>
                    {field.value === GuestType.SINGLE && (
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
                        field.value === GuestType.SINGLE
                          ? "bg-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      <User
                        className={`h-6 w-6 text-primary transition-all ${
                          field.value === GuestType.SINGLE ? "scale-110" : ""
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <RadioGroupItem
                        value={GuestType.SINGLE}
                        id='guest-single'
                        className='sr-only'
                      />
                      <span
                        className={`text-lg font-semibold block mb-1 ${
                          field.value === GuestType.SINGLE ? "text-primary" : ""
                        }`}
                      >
                        Je viens seul(e)
                      </span>
                      <p className='font-normal text-sm text-muted-foreground'>
                        Vous participerez en tant qu&apos;invité(e) unique
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none ${
                    field.value === GuestType.COUPLE
                      ? "border-primary bg-primary/5 shadow-md"
                      : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                  }`}
                  onClick={() => field.onChange(GuestType.COUPLE)}
                  tabIndex={0}
                  role='radio'
                  aria-checked={field.value === GuestType.COUPLE}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      field.onChange(GuestType.COUPLE);
                    }
                  }}
                >
                  <CardContent className='p-6 flex flex-col items-center space-y-3'>
                    {field.value === GuestType.COUPLE && (
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
                        field.value === GuestType.COUPLE
                          ? "bg-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      <Users
                        className={`h-6 w-6 text-primary transition-all ${
                          field.value === GuestType.COUPLE ? "scale-110" : ""
                        }`}
                      />
                    </div>
                    <div className='text-center'>
                      <RadioGroupItem
                        value={GuestType.COUPLE}
                        id='guest-couple'
                        className='sr-only'
                      />
                      <span
                        className={`text-lg font-semibold block mb-1 ${
                          field.value === GuestType.COUPLE ? "text-primary" : ""
                        }`}
                      >
                        Je viens avec mon/ma partenaire
                      </span>
                      <p className='font-normal text-sm text-muted-foreground'>
                        Vous devrez fournir les coordonnées de votre partenaire
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

export default GuestTypeStep;
