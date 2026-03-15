import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle2, User, Users } from "lucide-react";

// Enhanced form schema with validation messages in French
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." }),
    telephone: z
      .string()
      .min(10, { message: "Veuillez entrer un numéro de téléphone valide." }),
    attending: z.enum(["oui", "non", "maybe"], {
      required_error: "Veuillez indiquer si vous serez présent.",
    }),
    // New field to determine if coming alone or as a couple
    guestType: z.enum(["single", "couple"], {
      required_error: "Veuillez indiquer si vous venez seul ou en couple.",
    }),
    // Partner information (conditional)
    partnerName: z.string().optional(),
    // Events attendance
    attendBlessing: z.enum(["oui", "non"], {
      required_error: "Veuillez indiquer si vous assisterez à la bénédiction.",
    }),
    attendReception: z.enum(["oui", "non"], {
      required_error:
        "Veuillez indiquer si vous assisterez à la réception du soir.",
    }),
    hasKids: z.enum(["oui", "non"], {
      required_error: "Veuillez indiquer si vous venez avec des enfants.",
    }),
    kidsCount: z.string().optional(),
    kidsAges: z.string().optional(),
    // Optional dietary restrictions field
    dietaryRestrictions: z.string().optional(),
    // Optional notes field
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // If coming as a couple, partner name is required
      if (data.guestType === "couple" && data.attending === "oui") {
        return !!data.partnerName;
      }
      return true;
    },
    {
      message: "Veuillez indiquer le nom de votre partenaire.",
      path: ["partnerName"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface RsvpFormProps {
  className?: string;
}

const RsvpForm: React.FC<RsvpFormProps> = ({ className }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      attending: "oui",
      guestType: "single",
      partnerName: "",
      attendBlessing: "oui",
      attendReception: "oui",
      hasKids: "non",
      kidsCount: "",
      kidsAges: "",
      dietaryRestrictions: "",
      notes: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Watch values for conditional rendering
  const watchAttending = form.watch("attending");
  const watchGuestType = form.watch("guestType");
  const watchHasKids = form.watch("hasKids");

  // Function to handle next step
  const handleNextStep = async () => {
    const isValid = await form.trigger([
      "name",
      "email",
      "telephone",
      "attending",
      "guestType",
    ]);
    if (isValid) setCurrentStep(2);
  };

  // Function to handle previous step
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // In a real implementation, you would send this data to your backend
      console.log(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Réponse envoyée avec succès !", {
        description: `Merci, ${data.name}. Nous avons bien reçu votre réponse.`,
      });

      setSubmitted(true);
      // After 3 seconds, reset the form and step
      setTimeout(() => {
        form.reset();
        setSubmitted(false);
        setCurrentStep(1);
      }, 3000);
    } catch {
      toast.error("Une erreur est survenue", {
        description: "Veuillez réessayer plus tard.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Animation variants for form steps
  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  // Animation variants for success message
  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section
      id='rsvp'
      className={cn(
        "py-20 px-4 bg-gradient-to-b from-blue-50 to-blue-100 relative",
        className
      )}
    >
      <div className='container mx-auto'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-16'>
            <motion.div
              className='text-4xl md:text-5xl font-playfair font-bold mb-6'
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className='mb-4 text-gray-800'>RSVP</h2>
              <div className='h-1 w-24 bg-gold-500 mx-auto rounded-full'></div>
            </motion.div>

            <motion.p
              className='font-medium my-10 text-lg'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className='text-gray-700'>
                Répondez avant le 29 juin 2025
              </span>
            </motion.p>
          </div>

          <motion.div
            className='shadow-2xl bg-white/90 backdrop-blur-sm border border-gold-200 rounded-xl overflow-hidden relative'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div className='relative'>
              <Image
                src='/media/rsvp-sidney-2.png'
                alt='RSVP Invitation'
                width={500}
                height={200}
                className='w-full p-2 object-cover h-48 sm:h-56 md:h-64'
                priority
              />

              {/* Progress indicator */}
              {!submitted && (
                <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
                  {Array.from({ length: totalSteps }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className={`h-2 w-12 rounded-full ${
                        currentStep > idx ? "bg-gold-500" : "bg-white/50"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: "3rem" }}
                      transition={{ delay: 0.2 * idx, duration: 0.4 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <Form {...form}>
              <AnimatePresence mode='wait'>
                {submitted ? (
                  // Success message
                  <motion.div
                    key='success'
                    className='p-8 text-center flex flex-col items-center justify-center min-h-[300px]'
                    variants={successVariants}
                    initial='hidden'
                    animate='visible'
                  >
                    <div className='rounded-full bg-green-100 p-3 mb-4'>
                      <CheckCircle2 className='w-12 h-12 text-green-600' />
                    </div>
                    <h3 className='text-2xl font-playfair font-bold text-gray-800 mb-2'>
                      Merci pour votre réponse!
                    </h3>
                    <p className='text-gray-600 mb-6'>
                      Nous nous réjouissons de célébrer ce moment avec vous.
                    </p>
                  </motion.div>
                ) : currentStep === 1 ? (
                  // First step of the form
                  <motion.div
                    key='step1'
                    variants={formVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <form className='space-y-6 p-8'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form.control}
                          name='name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-foreground font-medium text-gray-700'>
                                Votre nom et prénom
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Jean Dupont'
                                  className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-foreground font-medium text-gray-700'>
                                Votre email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='jean@exemple.fr'
                                  className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name='telephone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-foreground font-medium text-gray-700'>
                              Votre téléphone
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='0612345678'
                                className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='attending'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-foreground font-medium text-gray-700'>
                              Serez-vous présent?
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4'
                              >
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <FormControl>
                                    <RadioGroupItem
                                      value='oui'
                                      className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                    Oui, je serai présent
                                  </FormLabel>
                                </FormItem>
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <FormControl>
                                    <RadioGroupItem
                                      value='non'
                                      className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                    Non, je serai absent
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* New field: Single or Couple */}
                      <AnimatePresence>
                        {watchAttending === "oui" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FormField
                              control={form.control}
                              name='guestType'
                              render={({ field }) => (
                                <FormItem className='space-y-3'>
                                  <FormLabel className='text-foreground font-medium text-gray-700'>
                                    Vous venez...
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4'
                                    >
                                      <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value='single'
                                            className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                          />
                                        </FormControl>
                                        <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors flex items-center'>
                                          <User className='w-4 h-4 mr-2' />
                                          Seul(e)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value='couple'
                                            className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                          />
                                        </FormControl>
                                        <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors flex items-center'>
                                          <Users className='w-4 h-4 mr-2' />
                                          En couple
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Partner name field (conditional) */}
                            <AnimatePresence>
                              {watchGuestType === "couple" && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <FormField
                                    control={form.control}
                                    name='partnerName'
                                    render={({ field }) => (
                                      <FormItem className='mt-4'>
                                        <FormLabel className='text-foreground font-medium text-gray-700'>
                                          Nom et prénom de votre partenaire
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Marie Dupont'
                                            className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* Event attendance section */}
                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                    <FormField
                                      control={form.control}
                                      name='attendBlessing'
                                      render={({ field }) => (
                                        <FormItem className='space-y-3'>
                                          <FormLabel className='text-foreground font-medium text-gray-700'>
                                            Bénédiction nuptiale
                                          </FormLabel>
                                          <FormControl>
                                            <RadioGroup
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                              className='flex space-x-4'
                                            >
                                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                  <RadioGroupItem
                                                    value='oui'
                                                    className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                                  />
                                                </FormControl>
                                                <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                                  J&apos;y assisterai
                                                </FormLabel>
                                              </FormItem>
                                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                  <RadioGroupItem
                                                    value='non'
                                                    className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                                  />
                                                </FormControl>
                                                <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
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
                                      name='attendReception'
                                      render={({ field }) => (
                                        <FormItem className='space-y-3'>
                                          <FormLabel className='text-foreground font-medium text-gray-700'>
                                            Réception du soir
                                          </FormLabel>
                                          <FormControl>
                                            <RadioGroup
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                              className='flex space-x-4'
                                            >
                                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                  <RadioGroupItem
                                                    value='oui'
                                                    className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                                  />
                                                </FormControl>
                                                <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                                  J&apos;y assisterai
                                                </FormLabel>
                                              </FormItem>
                                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                  <RadioGroupItem
                                                    value='non'
                                                    className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                                  />
                                                </FormControl>
                                                <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
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
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className='pt-4 flex justify-end'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          type='button'
                          onClick={handleNextStep}
                          className='bg-royal-600 text-white px-8 md:px-10 py-6 font-serif text-lg md:text-xl italic tracking-wide transition-all duration-300 shadow-lg rounded-full gold-hover-effect'
                        >
                          Continuer
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  // Second step of the form
                  <motion.div
                    key='step2'
                    variants={formVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-6 p-8'
                    >
                      <AnimatePresence>
                        {watchAttending !== "non" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Event attendance section */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                              <FormField
                                control={form.control}
                                name='attendBlessing'
                                render={({ field }) => (
                                  <FormItem className='space-y-3'>
                                    <FormLabel className='text-foreground font-medium text-gray-700'>
                                      Bénédiction nuptiale
                                    </FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className='flex space-x-4'
                                      >
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                          <FormControl>
                                            <RadioGroupItem
                                              value='oui'
                                              className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                            />
                                          </FormControl>
                                          <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                            J&apos;y assisterai
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                          <FormControl>
                                            <RadioGroupItem
                                              value='non'
                                              className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                            />
                                          </FormControl>
                                          <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
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
                                name='attendReception'
                                render={({ field }) => (
                                  <FormItem className='space-y-3'>
                                    <FormLabel className='text-foreground font-medium text-gray-700'>
                                      Réception du soir
                                    </FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className='flex space-x-4'
                                      >
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                          <FormControl>
                                            <RadioGroupItem
                                              value='oui'
                                              className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                            />
                                          </FormControl>
                                          <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                            J&apos;y assisterai
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                          <FormControl>
                                            <RadioGroupItem
                                              value='non'
                                              className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                            />
                                          </FormControl>
                                          <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
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

                            {/* Kids information section */}
                            <FormField
                              control={form.control}
                              name='hasKids'
                              render={({ field }) => (
                                <FormItem className='space-y-3 mb-6'>
                                  <FormLabel className='text-foreground font-medium text-gray-700'>
                                    Venez-vous avec des enfants (2-12 ans)?
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className='flex space-x-4'
                                    >
                                      <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value='oui'
                                            className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                          />
                                        </FormControl>
                                        <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                          Oui
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value='non'
                                            className='text-gold-500 border-gold-300 focus:ring-gold-500/40'
                                          />
                                        </FormControl>
                                        <FormLabel className='font-normal cursor-pointer text-gray-700 hover:text-gold-800 transition-colors'>
                                          Non
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Conditional fields for kids details */}
                            <AnimatePresence>
                              {watchHasKids === "oui" && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'
                                >
                                  <FormField
                                    control={form.control}
                                    name='kidsCount'
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className='text-foreground font-medium text-gray-700'>
                                          Nombre d&apos;enfants
                                        </FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className='input-royal border-gold-200 focus:ring-gold-500/40 focus:border-gold-500 w-full'>
                                              <SelectValue placeholder='Sélectionnez' />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent className='border-gold-200 bg-amber-100 backdrop-blur'>
                                            <SelectItem
                                              value='1'
                                              className='hover:bg-gold-50 focus:bg-gold-50'
                                            >
                                              1
                                            </SelectItem>
                                            <SelectItem
                                              value='2'
                                              className='hover:bg-gold-50 focus:bg-gold-50'
                                            >
                                              2
                                            </SelectItem>
                                            <SelectItem
                                              value='3'
                                              className='hover:bg-gold-50 focus:bg-gold-50'
                                            >
                                              3
                                            </SelectItem>
                                            <SelectItem
                                              value='4'
                                              className='hover:bg-gold-50 focus:bg-gold-50'
                                            >
                                              4
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name='kidsAges'
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className='text-foreground font-medium text-gray-700'>
                                          Âges des enfants
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Ex: 4, 7, 10 ans'
                                            className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <FormField
                              control={form.control}
                              name='dietaryRestrictions'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className='text-foreground font-medium text-gray-700'>
                                    Restrictions alimentaires{" "}
                                    <span className='text-gray-500 text-sm'>
                                      (optionnel)
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder='Ex: Végétarien, allergies, etc.'
                                      className='input-royal focus:ring-gold-500/50 focus:border-gold-500'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <FormField
                        control={form.control}
                        name='notes'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-foreground font-medium text-gray-700'>
                              Notes supplémentaires{" "}
                              <span className='text-gray-500 text-sm'>
                                (optionnel)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <textarea
                                placeholder='Informations additionnelles'
                                className='w-full min-h-[80px] p-3 rounded-md border border-gold-200 focus:ring-gold-500/40 focus:border-gold-500 outline-none transition-all resize-y'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='pt-4 flex justify-between'>
                        <Button
                          type='button'
                          onClick={handlePrevStep}
                          className='btn-secondary bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-full transition-all'
                          variant='outline'
                        >
                          Retour
                        </Button>

                        <Button
                          type='submit'
                          className='bg-royal-600 text-white px-8 md:px-10 py-6 font-serif text-lg md:text-xl italic tracking-wide transition-all duration-300 shadow-lg rounded-full gold-hover-effect'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className='flex items-center'>
                              <svg
                                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              Envoi en cours...
                            </div>
                          ) : (
                            "Envoyer ma réponse"
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </Form>
          </motion.div>

          {/* Additional decorative elements */}
          <motion.div
            className='text-center mt-10 text-gray-600 text-sm italic'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className='font-playfair'>
              Nous avons hâte de partager ce moment avec vous!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RsvpForm;
