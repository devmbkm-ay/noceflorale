import React from "react";
import { motion } from "framer-motion";
import {
  // CalendarDays,
  Clock,
  MapPin,
  // Gift,
  Calendar,
  Map,
} from "lucide-react";
// import { cn } from '@/lib/utils';
// import { CardContent } from '@/components/ui/card';
import { ArrowRight } from "lucide-react";

interface EventDetailsProps {
  className?: string;
}

const EventDetails: React.FC<EventDetailsProps> = () => {
  // Card hover animations

  // Icon hover animations

  return (
    <section id='event' className='relative py-30'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-4 gradient-text'>
            Détails du Programme
          </h2>
          <div className='w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4' />
          <span className='text-xl text-muted-foreground'>Save the Date</span>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Ceremony Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='card-royal'
          >
            <h3 className='text-2xl font-bold mb-4 gradient-text'>
              Bénédiction Nuptiale
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <Calendar className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>
                  Vendredi, 29 Août, 2025
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Clock className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>14h30</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Map className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>
                  2 Rue des Argiles Vertes, 77130
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-6 h-6 text-gold-500' />
                <span className='text-muted-foreground'>
                  Saint Germain Laval
                </span>
              </div>
            </div>
          </motion.div>

          {/* Reception Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='card-royal'
          >
            <h3 className='text-2xl font-bold mb-4 gradient-text'>
              Soirée de célébration à la Gloire de Dieu
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <Calendar className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>
                  Vendredi, 29 Août, 2025
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Clock className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>19h00</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Map className='w-6 h-6 text-gold-500' />
                <span className='text-foreground'>
                  2 Rue des Argiles Vertes, 77130
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-6 h-6 text-gold-500' />
                <span className='text-muted-foreground'>
                  Saint Germain Laval
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='mt-12 text-center'
        >
          <p className='text-muted-foreground mb-4'>
            Voici le jour que l&#39;Éternel a fait: qu&apos;il soit pour nous un
            sujet d&apos;allégresse et de joie! Psaumes 118:24
          </p>
          <a
            href='#rsvp'
            className='btn-royal inline-flex items-center space-x-2'
          >
            <span>RSVP Now</span>
            <ArrowRight className='w-4 h-4' />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
