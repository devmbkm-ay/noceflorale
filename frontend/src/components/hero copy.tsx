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
      style={{
        backgroundImage: "url('/images/maries-7.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        filter: "blur(0px)",
        WebkitFilter: "blur(0px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "overlay",
        backdropFilter: "blur(0px)",
        // WebkitBackdropFilter: "blur(0px)",
        // WebkitTextFillColor: "transparent",
        // WebkitTextStroke: "1px aliceblue",
        textShadow: "1px 0 0 rgb(1 1 1 / 50%)",
      }}
    >
      <motion.div
        className='container mx-auto px-4 z-10 text-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced image container with overlay text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className='relative my-6 md:my-10 inline-block items-center justify-center w-full mx-auto'
        >
          {/* <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-[1.01] w-full mx-auto h-[40vh] sm:h-[50vh] md:h-[60vh] card-royal"> */}
          <motion.h1
            className='text-3xl text-amber-50 md:text-4xl lg:text-6xl font-serif italic my-5 md:mb-8 tracking-tight leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className='relative inline-block z-500 font-serif italic tracking-wide leading-relaxed text-shadow text-center'>
              {/* On s&apos;est dit OUI! */}
              <br />
              {/* devant Dieu et devant les hommes<br /> */}
              {/* <span className="block mt-3 text-white font-serif text-4xl italic">Marie-Nella et Sidney</span>
                <span className="absolute inset-0 bg-gradient-to-r from-gold-400/10 to-royal-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span> */}
            </span>
          </motion.h1>
          {/* <Image
              src="/images/maries-7.png"
              alt="Sidney et Marie-Nella"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            /> */}

          {/* Enhanced gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30"></div> */}

          {/* Enhanced text overlay container */}
          {/* <motion.div 
              className='absolute inset-0 flex items-center justify-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            > */}
          <motion.div
            className='px-4 py-6 md:px-8 md:py-10 mx-4 md:mx-auto max-w-3xl backdrop-blur-sm bg-white/30 rounded-xl border border-white/30 shadow-xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
          >
            <motion.p
              className='lg:text-3xl sm:text-2xl md:text-2xl font-serif italic tracking-wide leading-relaxed mirror-text text-center '
              style={{
                color: "transparent",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "1px goldenrod",
                textShadow: "1px 0 0 rgb(1 1 1 / 50%)",
              }}
            >
              Vendredi 29 août 2025
              <br />
              pour célébrer notre union dans les liens sacrés du mariage.
              <br />
              <span className='block mt-3 text-white font-serif text-4xl italic'>
                Marie-Nella et Sidney
              </span>
            </motion.p>
          </motion.div>
          {/* </motion.div> */}
          {/* </div> */}
        </motion.div>

        <motion.div
          className='flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-6 md:mt-10 mb-8 md:mb-10'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            className='btn-royal px-6 md:px-8 py-5 md:py-6 font-serif text-lg md:text-xl italic tracking-wide hover:scale-105 transition-all duration-300 relative overflow-hidden group shadow-md'
            size='lg'
            onClick={() =>
              document
                .getElementById("rsvp")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className='font-serif italic relative z-10'>
              Répondez en ligne svp
            </span>
            <span className='absolute inset-0 bg-gold-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500'></span>
          </Button>

          <Button
            className='btn-gold px-6 md:px-8 py-5 md:py-6 font-serif text-lg md:text-xl italic tracking-wide hover:scale-105 transition-all duration-300 relative overflow-hidden group shadow-md'
            variant='ghost'
            size='lg'
            onClick={() =>
              document
                .getElementById("event")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className='font-serif italic relative z-10'>
              Details de l&apos;Evènement
            </span>
            <span className='absolute inset-0 bg-royal-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500'></span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className='absolute bottom-2 left-1/2 transform -translate-x-1/2'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{
          delay: 1.5,
          duration: 0.8,
          y: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
          },
        }}
      >
        {/* <div className="w-10 h-10 rounded-full border-2 border-gold-500 flex items-center justify-center"> */}
        {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> */}
        <Image
          src='/media/logo-mns.png'
          alt='Logo'
          width={20}
          height={20}
          sizes='100vw'
          className='h-16 w-auto transform transition-transform duration-300 hover:scale-105'
          priority
        />
        {/* <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="goldenrod" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> */}
        {/* </svg> */}
        {/* </div> */}
      </motion.div>
    </section>
  );
};

export default Hero;
