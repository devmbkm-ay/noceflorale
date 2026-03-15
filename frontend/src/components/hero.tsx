"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section
      id='home'
      className={cn(
        "min-h-screen flex flex-col items-center justify-center relative overflow-hidden",
        "pt-28 md:pt-32 lg:pt-36",
        className
      )}
    >
      {/* Enhanced Background with animated zoom and pan effect */}
      <motion.div
        className='absolute inset-0 z-0 pointer-events-none overflow-hidden'
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: [1, 1.05, 1.02, 1],
          x: [0, -5, 5, 0],
          y: [0, 5, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
      >
        <Image
          src='/images/sourire.jpg'
          alt='Wedding background'
          fill
          priority
          className='object-cover object-center'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
          // className='
          // object-cover w-full filter brightness-90 contrast-125
          // object-[30%_10%] sm:object-[50%_50%] md:object-[75%_75%] lg:object-cover'
          // sizes='(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw, (min-height: 500px) 100vw'
          quality={100}
          unoptimized={true} // Required for static export
          onError={(e) => {
            // Fallback to a simpler background if image fails to load
            console.error("Image failed to load, using fallback");
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite error loop
            target.src = "/images/placeholder.jpg"; // Fallback image path
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 sm:bg-gradient-to-b sm:from-black/40 sm:via-transparent sm:to-black/60'></div>
      </motion.div>

      <motion.div
        className='container mx-auto px-4 z-10 text-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Elegant title with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className='mb-8'
        >
          <motion.h1
            className='text-4xl md:text-5xl lg:text-7xl font-serif italic text-white mb-5 md:mb-8 tracking-tight leading-relaxed drop-shadow-lg'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* <span className="block mb-2 justify-center">On s'est dit OUI!</span> */}
            {/* <span className="block text-2xl md:text-3xl lg:text-4xl text-royal-200/90 font-light">devant Dieu et devant les hommes</span> */}
          </motion.h1>
        </motion.div>

        {/* Enhanced content card with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className='relative my-6 md:my-10 inline-block w-full max-w-4xl mx-auto mt-28 sm:mt-16 md:mt-6'
        >
          <div className='flex flex-col mt-7 space-y-5 sm:space-y-3'>
            <motion.p
              className='text-sm sm:text-1/2xl md:text-2xl lg:text-3xl font-serif tracking-wide text-center px-2 py-2 backdrop-blur-sm sm:backdrop-blur-md bg-black/50 sm:bg-black/30 md:bg-black/10 rounded-lg inline-block mx-auto'
              style={{
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
            >
              Rejoignez-nous le vendredi 29 août 2025, à 14h30
            </motion.p>

            <motion.p
              className='text-sm sm:text-xl md:text-2xl lg:text-3xl font-serif tracking-wide text-center px-2 py-2 backdrop-blur-sm sm:backdrop-blur-md bg-black/50 sm:bg-black/30 md:bg-black/10 rounded-lg inline-block mx-auto'
              style={{
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              pour célébrer notre union dans les liens sacrés du mariage.
            </motion.p>

            <motion.div
              className='mt-8 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm sm:backdrop-blur-lg bg-black/60 sm:bg-black/40 md:bg-white/20 rounded-xl border border-white/30 shadow-lg inline-block mx-auto'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <span className='block text-white font-serif text-2xl sm:text-3xl md:text-5xl italic relative'>
                <span className='absolute -left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gold-400'></span>
                Marie-Nella et Sidney vont se dire oui!
                <span className='absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gold-400'></span>
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced buttons with animations */}
        <motion.div
          className='flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center mt-10 mb-20 sm:mb-16 md:mt-12 md:mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            className='bg-royal-600  text-white hover:bg-white/10 px-8 md:px-10 py-6 font-serif text-lg md:text-xl italic tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl rounded-full'
            size='lg'
            onClick={() =>
              document
                .getElementById("rsvp")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className='font-serif italic relative z-10'>
              Répondez en ligne SVP
            </span>
          </Button>

          <Button
            className='bg-transparent border-2 border-white/70 text-white hover:bg-white/10 px-8 md:px-10 py-6 font-serif text-lg md:text-xl italic tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl rounded-full'
            variant='outline'
            size='lg'
            onClick={() =>
              document
                .getElementById("event")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className='font-serif italic relative z-10'>
              Détails de l&apos;Événement
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Elegant scroll indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.5,
          duration: 0.8,
        }}
      >
        <motion.div
          className='flex flex-col items-center'
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <div className='w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center text-center mb-2 backdrop-blur-sm bg-white/5'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 5V19M12 19L5 12M12 19L19 12'
                stroke='goldenrod'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <span className='hidden md:block text-white text-sm font-serif italic'>
            Faites défiler pour en savoir plus
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
