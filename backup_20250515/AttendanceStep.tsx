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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AttendanceStatus } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Check } from "lucide-react";
import { motion } from "framer-motion";

const AttendanceStep: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className='space-y-8'>
      <div className='mb-6'>
        <p className='text-muted-foreground mt-1'>
          Veuillez fournir vos coordonnées et nous indiquer si vous pouvez vous
          joindre à nous
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={control}
          name='primaryGuest.name'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-name'
                className='text-foreground font-medium'
              >
                Votre nom complet
              </FormLabel>
              <FormControl>
                <Input
                  id='primary-guest-name'
                  placeholder='Votre nom complet'
                  className='input-royal transition-all duration-300 focus:ring focus:ring-primary/30 focus:border-primary'
                  {...field}
                  name='primary-guest-name'
                  autoComplete='name'
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='primaryGuest.email'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-name'
                className='text-foreground font-medium'
              >
                Votre email
              </FormLabel>
              <FormControl>
                <Input
                  id='primary-guest-email'
                  type='email'
                  placeholder='votre@email.com'
                  className='input-royal'
                  {...field}
                  name='primary-guest-email'
                  autoComplete='email'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='pt-4'>
        <div className='text-center mb-6'>
          <h2 className='text-xl font-bold text-primary'>
            Serez-vous présent à notre mariage?
          </h2>
          <p className='text-muted-foreground mt-1'>
            Veuillez nous indiquer si vous pouvez vous joindre à nous pour notre
            journée spéciale
          </p>
        </div>

        <FormField
          control={control}
          name='primaryGuest.attending'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className='grid grid-cols-1 md:grid-cols-2 gap-4'
                >
                  <Card
                    className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none 
                            ${
                              field.value === AttendanceStatus.YES
                                ? "border-primary bg-primary/5 shadow-md"
                                : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                            }`}
                    onClick={() => field.onChange(AttendanceStatus.YES)}
                    tabIndex={0}
                    role='radio'
                    aria-checked={field.value === AttendanceStatus.YES}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        field.onChange(AttendanceStatus.YES);
                      }
                    }}
                  >
                    <CardContent className='p-6 flex flex-col items-center space-y-3'>
                      {field.value === AttendanceStatus.YES && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-2 right-2 bg-green-500 text-white rounded-full p-1'
                        >
                          <Check className='h-4 w-4' />
                        </motion.div>
                      )}
                      <div
                        className={`bg-green-100 p-3 rounded-full transition-all ${
                          field.value === AttendanceStatus.YES
                            ? "bg-green-200 scale-110"
                            : "hover:bg-green-200"
                        }`}
                      >
                        <CheckCircle2 className='h-6 w-6 text-green-600' />
                      </div>
                      <div className='text-center'>
                        <RadioGroupItem
                          value={AttendanceStatus.YES}
                          id='attending-yes'
                          className='sr-only'
                        />
                        <span
                          className={`text-lg font-semibold block mb-1 ${
                            field.value === AttendanceStatus.YES
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Je serai présent(e)
                        </span>
                        <p className='font-normal text-sm text-muted-foreground'>
                          Je serai là pour célébrer avec vous
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`relative cursor-pointer border-2 outline-none transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md focus:ring focus:ring-primary/40 focus:outline-none
                            ${
                              field.value === AttendanceStatus.NO
                                ? "border-primary bg-primary/5 shadow-md"
                                : "hover:border-primary/50 hover:bg-accent/80 active:scale-[0.98]"
                            }`}
                    onClick={() => field.onChange(AttendanceStatus.NO)}
                    tabIndex={0}
                    role='radio'
                    aria-checked={field.value === AttendanceStatus.NO}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        field.onChange(AttendanceStatus.NO);
                      }
                    }}
                  >
                    <CardContent className='p-6 flex flex-col items-center space-y-3'>
                      {field.value === AttendanceStatus.NO && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1'
                        >
                          <Check className='h-4 w-4' />
                        </motion.div>
                      )}
                      <div
                        className={`bg-red-100 p-3 rounded-full transition-all ${
                          field.value === AttendanceStatus.NO
                            ? "bg-red-200 scale-110"
                            : "hover:bg-red-200"
                        }`}
                      >
                        <XCircle className='h-6 w-6 text-red-600' />
                      </div>
                      <div className='text-center'>
                        <RadioGroupItem
                          value={AttendanceStatus.NO}
                          id='attending-no'
                          className='sr-only'
                        />
                        <span
                          className={`text-lg font-semibold block mb-1 ${
                            field.value === AttendanceStatus.NO
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Je ne pourrai pas être présent(e)
                        </span>
                        <p className='font-normal text-sm text-muted-foreground'>
                          Je manquerai la célébration
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
    </div>
  );
};

export default AttendanceStep;
