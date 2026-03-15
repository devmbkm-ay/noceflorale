import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRsvpForm, formSchema } from '@/contexts/RsvpFormContext';

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
};

const EventDetailsStep: React.FC = () => {
  const { 
    formValues, 
    setFormValues, 
    isSubmitting, 
    submitForm, 
    prevStep 
  } = useRsvpForm();
  
  const form = useForm({
    resolver: zodResolver(formSchema.pick({
      attendBlessing: true,
      attendReception: true,
      partnerAttendBlessing: true,
      partnerAttendReception: true,
    //   dietaryRestrictions: true,
    //   notes: true,
    })),
    defaultValues: {
      attendBlessing: formValues.attendBlessing as "oui" | "non" | undefined,
      attendReception: formValues.attendReception as "oui" | "non" | undefined,
      partnerAttendBlessing: formValues.partnerAttendBlessing as "oui" | "non" | undefined,
      partnerAttendReception: formValues.partnerAttendReception as "oui" | "non" | undefined,
    //   dietaryRestrictions: formValues.dietaryRestrictions || "",
    //   notes: formValues.notes || "",
    },
  });
  
  const handleSubmit = async (data: {
    attendBlessing: "oui" | "non" | undefined;
    attendReception: "oui" | "non" | undefined;
    partnerAttendBlessing: "oui" | "non" | undefined;
    partnerAttendReception: "oui" | "non" | undefined;
    // dietaryRestrictions: string;
    // notes: string;
  }) => {
    // Update context with form values
    setFormValues(data);
    // Submit the form
    await submitForm();
  };
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-8">
          <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-6 text-center">
            Détails de l&apos;événement
          </h3>
          
          <AnimatePresence>
            {formValues.attending !== "non" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Main guest attendance options */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Votre participation aux événements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="attendBlessing"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-foreground font-medium text-gray-700">Bénédiction nuptiale</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="oui" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                  J&apos;y assisterai
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="non" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                  Je n&apos;y assisterai pas
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="attendReception"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-foreground font-medium text-gray-700">Réception du soir</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="oui" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                  J&apos;y assisterai
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="non" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                  Je n&apos;y assisterai pas
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Partner attendance section - conditionally rendered */}
                <AnimatePresence>
                  {formValues.hasPartner === "oui" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-50 p-6 rounded-lg border border-blue-100 mt-6 mb-8"
                    >
                      <h4 className="text-lg font-medium text-gray-700 mb-4">
                        Participation de {formValues.partner?.fullName || "votre accompagnant(e)"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="partnerAttendBlessing"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-foreground font-medium text-gray-700">Bénédiction nuptiale</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "oui"}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="oui" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                      Y assistera
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="non" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                      N&apos;y assistera pas
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="partnerAttendReception"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-foreground font-medium text-gray-700">Réception du soir</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "oui"}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="oui" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                      Y assistera
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="non" className="text-gold-500 border-gold-300 focus:ring-gold-500/40" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                                      N&apos;y assistera pas
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dietary Restrictions */}
          {/* <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium text-gray-700">
                  Restrictions alimentaires <span className="text-gray-500 text-sm">(optionnel)</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Allergies, régimes spéciaux, etc." 
                    className="input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Notes/Message */}
          {/* <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium text-gray-700">
                  Message aux mariés <span className="text-gray-500 text-sm">(optionnel)</span>
                </FormLabel>
                <FormControl>
                  <textarea 
                    placeholder="Votre message..." 
                    className="w-full p-3 rounded-md border border-gold-200 focus:ring-gold-500/40 focus:border-gold-500 outline-none transition-all min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <div className="pt-4 flex justify-between">
            <Button 
              type="button" 
              onClick={prevStep}
              className="btn-secondary bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-full transition-all"
              variant="outline"
            >
              Retour
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-royal-600 text-white px-8 md:px-10 py-2.5 font-medium tracking-wide transition-all duration-300 shadow-md rounded-full hover:bg-royal-700 focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer ma réponse"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default EventDetailsStep;
