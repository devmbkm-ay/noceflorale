import React from "react";
import {
  useFormContext,
  // FormState
} from "react-hook-form";
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
// import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Check, Phone } from "lucide-react";
import { motion } from "framer-motion";

const AttendanceStep: React.FC = () => {
  const {
    control,
    // formState
  } = useFormContext();

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
          name='primaryGuest.firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-firstName'
                className='text-foreground font-medium'
              >
                Votre prénom
              </FormLabel>
              <FormControl>
                <Input
                  id='primary-guest-firstName'
                  placeholder='Votre prénom'
                  className='input-royal transition-all duration-300 focus:ring focus:ring-primary/30 focus:border-primary'
                  {...field}
                  value={field.value || ""}
                  name='primary-guest-firstName'
                  autoComplete='given-name'
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='primaryGuest.lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-lastName'
                className='text-foreground font-medium'
              >
                Votre nom
              </FormLabel>
              <FormControl>
                <Input
                  id='primary-guest-lastName'
                  placeholder='Votre nom'
                  className='input-royal transition-all duration-300 focus:ring focus:ring-primary/30 focus:border-primary'
                  {...field}
                  value={field.value || ""}
                  name='primary-guest-lastName'
                  autoComplete='family-name'
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
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-email'
                className='text-foreground font-medium'
              >
                Votre email
              </FormLabel>
              <div className='relative'>
                <FormControl>
                  <Input
                    id='primary-guest-email'
                    type='email'
                    placeholder='votre@email.com'
                    className={`input-royal ${
                      fieldState.error
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    } pr-8`}
                    {...field}
                    name='primary-guest-email'
                    autoComplete='email'
                  />
                </FormControl>
                {fieldState.error?.message?.includes("déjà utilisé") && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <span className='text-red-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              {fieldState.error?.message?.includes("déjà utilisé") && (
                <p className='text-sm text-red-600 mt-1'>
                  <a
                    href='mailto:floralenoce@gmail.com'
                    className='underline hover:text-red-700'
                  >
                    Contactez les mariés
                  </a>{" "}
                  pour modifier votre RSVP existant.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='primaryGuest.telephone'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='primary-guest-telephone'
                className='text-foreground font-medium'
              >
                Votre téléphone *
              </FormLabel>
              <div className='relative'>
                <FormControl>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='primary-guest-telephone'
                      placeholder='Votre numéro de téléphone'
                      className='input-royal pl-10'
                      {...field}
                      value={field.value || ""}
                      name='primary-guest-telephone'
                      autoComplete='tel'
                      required
                    />
                  </div>
                </FormControl>
              </div>
              <p className='text-xs text-muted-foreground mt-1'>Format: +33 6 12 34 56 78 ou 06 12 34 56 78 (obligatoire)</p>
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
              <FormLabel className='sr-only'>Présence au mariage</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className='grid grid-cols-1 md:grid-cols-2 gap-4'
                >
                  <div className='relative'>
                    <RadioGroupItem
                      id='attending-yes'
                      value={AttendanceStatus.YES}
                      className='sr-only'
                    />
                    <label
                      htmlFor='attending-yes'
                      className={`block cursor-pointer relative border-2 rounded-lg transition-shadow duration-300 transform hover:scale-[1.02] hover:shadow-md p-6 ${
                        field.value === AttendanceStatus.YES
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <div className='flex flex-col items-center space-y-3'>
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
                        <span
                          className={`text-lg font-semibold block ${
                            field.value === AttendanceStatus.YES
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Je serai présent(e)
                        </span>
                        <p className='text-muted-foreground text-sm'>
                          Je serai là pour célébrer avec vous
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className='relative'>
                    <RadioGroupItem
                      id='attending-no'
                      value={AttendanceStatus.NO}
                      className='sr-only'
                    />
                    <label
                      htmlFor='attending-no'
                      className={`block cursor-pointer relative border-2 rounded-lg transition-shadow duration-300 transform hover:scale-[1.02] hover:shadow-md p-6 ${
                        field.value === AttendanceStatus.NO
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <div className='flex flex-col items-center space-y-3'>
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
                        <span
                          className={`text-lg font-semibold block ${
                            field.value === AttendanceStatus.NO
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          Je ne pourrai pas être présent(e)
                        </span>
                        <p className='text-muted-foreground text-sm'>
                          Je manquerai la célébration
                        </p>
                      </div>
                    </label>
                  </div>
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
