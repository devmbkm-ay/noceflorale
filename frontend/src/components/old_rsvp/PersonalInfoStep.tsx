import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRsvpForm, formSchema } from '@/contexts/RsvpFormContext';
import { Calendar, Mail, Phone, User, Users, PartyPopper } from 'lucide-react';

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
};

const PersonalInfoStep: React.FC = () => {
  const { formValues, setFormValues, nextStep } = useRsvpForm();
  
  const form = useForm({
    resolver: zodResolver(formSchema.pick({
      name: true,
      email: true,
      telephone: true,
      attending: true,
      hasPartner: true,
      partner: true,
      hasKids: true,
      attendBlessing: true,
      attendReception: true,
    })),
    defaultValues: {
      name: formValues.name,
      email: formValues.email,
      telephone: formValues.telephone,
      attending: formValues.attending,
      hasPartner: formValues.hasPartner,
      partner: formValues.partner,
      hasKids: formValues.hasKids,
      attendBlessing: formValues.attendBlessing,
      attendReception: formValues.attendReception,
    },
  });
  
  // Watch values for conditional rendering
  const watchHasPartner = form.watch("hasPartner");
  const watchAttending = form.watch("attending");

  const handleNextStep = async () => {
     try {
    const isValid = await form.trigger();
    if (isValid) {
      setFormValues(form.getValues());
      nextStep();
    } else {
      // Add this to see validation errors in console
      console.log("Form validation errors:", form.formState.errors);
    }
  } catch (error) {
    console.error("Error in form validation:", error);
  }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Form {...form}>
        <form className="space-y-6 p-8" onSubmit={form.handleSubmit(handleNextStep)}>
          <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-6 text-center">
            Veuillez remplir le formulaire s&apos;il vous plaît
          </h3>
          
          {/* Personal Information Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-royal-600" />
              Informations personnelles
            </h4>
            
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium text-gray-700">Votre nom et prénom</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Jean Dupont" 
                          className="pl-10 input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                          {...field} 
                          aria-required="true"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input 
                            placeholder="email@exemple.com" 
                            type="email"
                            className="pl-10 input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                            {...field} 
                            aria-required="true"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium text-gray-700">Téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input 
                            placeholder="01 23 45 67 89" 
                            type="tel"
                            className="pl-10 input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                            {...field} 
                            aria-required="true"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Attendance Card */}
          <div className="bg-gradient-to-r from-amber-50 to-gold-50 p-6 rounded-xl border border-amber-100 shadow-sm mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gold-600" />
              Votre présence
            </h4>
            
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium text-gray-700">Serez-vous présent(e) ?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="oui" 
                              className="text-gold-500 border-gold-300 focus:ring-gold-500/40" 
                              aria-label="Oui, je serai présent(e)"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                            Oui
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="non" 
                              className="text-gold-500 border-gold-300 focus:ring-gold-500/40" 
                              aria-label="Non, je ne serai pas présent(e)"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors">
                            Non
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnimatePresence>
                {watchAttending === "oui" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 pb-2 border-t border-amber-200/50">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Guests Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Si vous etes un couple
            </h4>
            
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="hasPartner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium text-gray-700">Votre compagnant(e) sera présente(e) ?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="oui" 
                              className="text-purple-500 border-purple-300 focus:ring-purple-500/40" 
                              aria-label="Oui, je viendrai accompagné(e)"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-purple-800 transition-colors">
                            Oui
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="non" 
                              className="text-purple-500 border-purple-300 focus:ring-purple-500/40" 
                              aria-label="Non, je ne viendrai pas accompagné(e)"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-purple-800 transition-colors">
                            Non
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnimatePresence>
                {watchHasPartner === "oui" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mt-4">
                      <h4 className="text-lg font-medium text-gray-700 mb-4">
                        Informations de l&apos;accompagnant(e)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="partner.fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium text-gray-700">Nom et prénom</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                  <Input 
                                    placeholder="Jean Dupont" 
                                    className="pl-10 input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="partner.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium text-gray-700">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                  <Input 
                                    placeholder="email@exemple.com" 
                                    className="pl-10 input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Kids Section */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100 shadow-sm mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <PartyPopper className="mr-2 h-5 w-5 text-teal-600" />
              Enfants
            </h4>
            
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="hasKids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium text-gray-700">Viendrez-vous avec des enfants ?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="oui" 
                              className="text-teal-500 border-teal-300 focus:ring-teal-500/40" 
                              aria-label="Oui, je viendrai avec des enfants"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-teal-800 transition-colors">
                            Oui
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="non" 
                              className="text-teal-500 border-teal-300 focus:ring-teal-500/40" 
                              aria-label="Non, je ne viendrai pas avec des enfants"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-700 hover:text-teal-800 transition-colors">
                            Non
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
          
          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button 
                type="button"
                onClick={handleNextStep}
                className="bg-royal-600 text-white px-8 md:px-10 py-2.5 font-medium tracking-wide transition-all duration-300 shadow-md rounded-full hover:bg-royal-700 focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2">
                Suivant
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};
export default PersonalInfoStep;