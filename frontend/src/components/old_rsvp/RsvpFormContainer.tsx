import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRsvpForm } from "@/contexts/RsvpFormContext";
import PersonalInfoStep from "./PersonalInfoStep";
import ChildrenInfoStep from "./ChildrenInfoStep";
import EventDetailsStep from "./EventDetailsStep";
import { cn } from "@/lib/utils";

interface RsvpFormContainerProps {
  className?: string;
}

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

const RsvpFormContainer: React.FC<RsvpFormContainerProps> = ({ className }) => {
  const { currentStep, submitted } = useRsvpForm();
  const totalSteps = 3;

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
              <span className='text-gray-700'>Répondez avant 29 juin 2025</span>
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
              ) : (
                // Form steps
                <>
                  {currentStep === 1 && <PersonalInfoStep />}
                  {currentStep === 2 && <ChildrenInfoStep />}
                  {currentStep === 3 && <EventDetailsStep />}
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            className='mt-12 text-center text-gray-700'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className='mb-2'>
              Pour toute question concernant votre présence, merci de nous
              contacter:
            </p>
            <p className='font-medium'>contact@exemple.fr ou 01 23 45 67 89</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RsvpFormContainer;
