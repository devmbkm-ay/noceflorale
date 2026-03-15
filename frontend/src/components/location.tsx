import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, Car, Bus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LocationProps {
  className?: string;
}

const Location: React.FC<LocationProps> = ({ className }) => {
  return (
    <section
      id='location'
      className={cn("py-20 px-4 bg-royal-500 relative", className)}
    >
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <motion.p
            className='text-gold-500 font-medium mb-3 gradient-text'
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            VENUE
          </motion.p>
          <motion.h2
            className='text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Localisation de l&apos;emplacement
          </motion.h2>
          <div className='w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4' />
          <span className='text-xl text-muted-foreground'>
            Comment nous trouver
          </span>
          <motion.p
            className='text-foreground max-w-2xl mx-auto mt-6'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Nous avons sélectionné un lieu d&apos;exception pour célébrer ce
            jour unique. Vous trouverez ici toutes les informations nécessaires
            pour vous joindre à nous.
          </motion.p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          {/* Map Section */}
          <motion.div
            className='rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px] relative'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className='absolute inset-0 bg-black/5 z-10 pointer-events-none'></div>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d336268.79515338893!2d2.1074191491288283!3d48.62024722607093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!3m2!1d48.856614!2d2.3522219!4m5!1s0x47ef35be3cc13c69%3A0xca23fb9a15cfcf8d!2s2%20Rue%20des%20Argiles%20Vertes%2C%2077130%20Saint-Germain-Laval%2C%20France!3m2!1d48.3905996!2d3.0400668!5e0!3m2!1sfr!2sfr!4v1717506211831!5m2!1sfr!2sfr'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen={false}
              loading='lazy'
              title='Directions from Paris to wedding venue'
              className='grayscale hover:grayscale-0 transition-all duration-500'
            ></iframe>
          </motion.div>

          {/* Details Section */}
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Venue Card */}
            <div className='card-royal p-6 rounded-xl'>
              <div className='flex items-start space-x-4'>
                <MapPin className='w-6 h-6 text-gold-500 mt-1 flex-shrink-0' />
                <div>
                  <h3 className='text-xl font-semibold mb-2 gradient-text'>
                    Salle : PALAIS 77
                  </h3>
                  {/* <p className='text-foreground mb-3'>
                    2 Rue des Argiles Vertes,
                    <br />
                    77130 Saint Germain Laval
                  </p> */}
                  <p className='text-muted-foreground text-sm'>
                    2 Rue des Argiles Vertes,
                    <br />
                    77130 Saint Germain Laval
                  </p>
                </div>
              </div>
            </div>

            {/* Transportation Options */}
            <div className='card-royal p-6 rounded-xl'>
              <h3 className='text-xl font-semibold mb-4 gradient-text'>
                Comment s&apos;y rendre
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start space-x-4'>
                  <Car className='w-5 h-5 text-gold-500 mt-1 flex-shrink-0' />
                  <div>
                    <h4 className='font-medium'>En voiture</h4>
                    <p className='text-sm text-muted-foreground'>
                      Prendre l&apos;A5 depuis Paris, sortie n°17 « Forges »
                      puis suivre la direction Saint-Germain-Laval
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <Bus className='w-5 h-5 text-gold-500 mt-1 flex-shrink-0' />
                  <div>
                    <h4 className='font-medium'>Transport Publique</h4>
                    <p className='text-sm text-muted-foreground'>
                      Depuis la gare de Montereau, prendre le bus ligne 3304
                      direction Saint-Germain-Laval <br />
                      arrêt le plus proche: Village, à 2 min à pied de la rue
                      des Argiles Vertes.
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <Clock className='w-5 h-5 text-gold-500 mt-1 flex-shrink-0' />
                  <div>
                    <h4 className='font-medium'>Temps de parcours</h4>
                    <p className='text-sm text-muted-foreground'>
                      1h-30mn du centre de Paris, 1h-15mn de l&apos;aéroport
                      Charles de Gaulle et 1h-09mn de l&apos;aéroport
                      d&apos;Orly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <div className='flex justify-center pt-4'>
              <Button
                className='bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white'
                size='lg'
                onClick={() =>
                  window.open(
                    "https://maps.google.com/?q=2+Rue+des+Argiles+Vertes,+77130+Saint+Germain+Laval",
                    "_blank"
                  )
                }
              >
                <Navigation className='mr-2 h-4 w-4' /> Get Directions
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Nearby Accommodations */}
        <motion.div
          className='mt-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className='text-2xl font-semibold text-center mb-8 gradient-text'>
            Hébergements à proximité
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[
              {
                name: "ENZO HOTELS CANNES ECLUSE by Kyriad",
                address: "1 Rue des Tournesols, 77130 Cannes-Écluse Montereau",
                tel: "+33 1 64 70 03 05",
                image: "/media/kyriad-hotel.jpg",
                distance: "4km de la salle du Palais 77",
              },
              {
                name: "FASTHOTEL PARIS SUD ESMANS-MONTEREAU",
                address: "Route du Petit Fossard, 77940 Esmans Montereau",
                tel: "+33 1 60 74 85 26",
                image: "/media/fasthotel.jpg",
                distance: "7km de la salle du Palais 77",
              },
            ].map((hotel, index) => (
              <div
                key={index}
                className='card-royal rounded-xl overflow-hidden transition-transform hover:scale-[1.02] duration-300'
              >
                <div className='relative h-48'>
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className='object-cover'
                    unoptimized={true} // Required for static export compatibility
                    onError={(e) => {
                      // Fallback handling for image loading errors
                      console.error(
                        `Failed to load hotel image: ${hotel.image}`
                      );
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite error loop
                      target.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className='p-4'>
                  <h4 className='font-semibold text-lg'>{hotel.name}</h4>
                  <p className='text-sm text-muted-foreground'>
                    {hotel.address}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {hotel.distance}
                  </p>
                  <div className='flex justify-between items-center mt-2'>
                    <span className='text-gold-500'>Standard: {hotel.tel}</span>
                    {/* <Button variant='link' className='text-gold-500 p-0'>
                      Reservez:{hotel.tel}
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Location;
