"use client";

import { useRef, ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnimatePresence, motion } from "framer-motion";

interface PublicLayoutProps {
  children: ReactNode;
  className?: string;
  showAdminDashboard?: boolean;
}

const PublicLayout = ({
  children,
  className = "",
  showAdminDashboard = false,
}: PublicLayoutProps) => {
  // Create refs for the sections that can be navigated to from the header
  const homeRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  // Refs for each section that will be passed to the Header component
  const sectionRefs = {
    home: homeRef,
    event: eventRef,
    rsvp: rsvpRef,
    gallery: galleryRef,
    location: locationRef,
    admin: adminRef,
  };

  // Page transition variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Header with section refs for navigation */}
      <Header sectionRefs={sectionRefs} />

      {/* Main content with smooth transitions */}
      <AnimatePresence mode='wait'>
        <motion.main
          className={`flex-grow pt-24 ${className}`}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={pageVariants}
        >
          {/* Section references setup for scroll navigation */}
          <div ref={homeRef} id='home' className='scroll-mt-24'>
            {/* Home section content will be injected here if needed */}
          </div>

          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            {children}
          </div>

          {/* Additional section references for navigation */}
          <div ref={eventRef} id='event' className='scroll-mt-24'></div>
          <div ref={rsvpRef} id='rsvp' className='scroll-mt-24'></div>
          <div ref={galleryRef} id='gallery' className='scroll-mt-24'></div>
          <div ref={locationRef} id='location' className='scroll-mt-24'></div>

          {/* Admin Dashboard Section */}
          <div ref={adminRef} id='admin' className='scroll-mt-24'>
            {showAdminDashboard && (
              <div className='min-h-screen bg-gray-100 p-6'>
                {/* Your admin dashboard content here */}
                <div className='max-w-7xl mx-auto'>
                  <h1 className='text-3xl font-bold text-gray-900 mb-8'>
                    Admin Dashboard
                  </h1>
                  {/* Add your admin components here */}
                </div>
              </div>
            )}
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;